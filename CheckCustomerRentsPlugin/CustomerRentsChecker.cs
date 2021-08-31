using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xrm.Sdk;
using System.ServiceModel;
using Microsoft.Xrm.Sdk.Query;

namespace CheckCustomerRentsPlugin
{
    public class CustomerRentsChecker : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // Obtain the tracing service
            ITracingService tracingService =
            (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            // Obtain the execution context from the service provider.  
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));

            // The InputParameters collection contains all the data passed in the message request.  
            if (context.InputParameters.Contains("Target") &&
                context.InputParameters["Target"] is Entity)
            {
                // Obtain the target entity from the input parameters.  
                var target = (context.InputParameters["Target"] as Entity).ToEntity<cr03e_rent>();

                // Obtain the organization service reference which you will need for  
                // web service calls.  
                IOrganizationServiceFactory serviceFactory =
                    (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
                IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);

                try
                {
                    var currentStatus = target.cr03e_Status;
                    
                    if (currentStatus == cr03e_rent_cr03e_Status.Renting_Active)
                    {
                        Guid customerId = target.cr03e_Customer.Id;

                        bool createRentsAvailable = IsCreationRentAvailable(customerId, currentStatus.Value, service);

                        if(!createRentsAvailable)
                        {
                            throw new InvalidPluginExecutionException("Customer has 10 or more acvite Rents");
                        }
                    }
                }

                catch (FaultException<OrganizationServiceFault> ex)
                {
                    throw new InvalidPluginExecutionException("An error occurred in FollowUpPlugin.", ex);
                }

                catch (Exception ex)
                {
                    tracingService.Trace("FollowUpPlugin: {0}", ex.ToString());
                    throw;
                }

            }
        }

        private bool IsCreationRentAvailable(Guid customerId, cr03e_rent_cr03e_Status status, IOrganizationService service)
        {
            var query = new QueryExpression("cr03e_rent")
            {
                ColumnSet = new ColumnSet("cr03e_name"),
                Criteria =
                {
                    Filters =
                    {
                        new FilterExpression(LogicalOperator.And)
                        {
                            Conditions =
                            {
                                new ConditionExpression("cr03e_status", ConditionOperator.Equal, (int)status),
                                new ConditionExpression("cr03e_customer", ConditionOperator.Equal, customerId)
                            }
                        }
                    }
                }

            };

            var rents = service.RetrieveMultiple(query).Entities;

            return rents.Count >= 10 ? false : true;
            
        }

    }
}
