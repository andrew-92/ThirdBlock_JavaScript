//------------------------------------------------------------------------------
// <auto-generated>
//     Этот код создан программой.
//
//     Изменения в этом файле могут привести к неправильной работе и будут потеряны в случае
//     повторной генерации кода.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CheckCustomerRentsPlugin
{
	
	[System.Runtime.Serialization.DataContractAttribute()]
	public enum cr03e_rent_cr03e_Status
	{
		
		[System.Runtime.Serialization.EnumMemberAttribute()]
		[OptionSetMetadataAttribute("Canceled (Inactive)", 4, "#0000ff")]
		Canceled_Inactive = 177740005,
		
		[System.Runtime.Serialization.EnumMemberAttribute()]
		[OptionSetMetadataAttribute("Confirmed (Active)", 1, "#0000ff")]
		Confirmed_Active = 177740002,
		
		[System.Runtime.Serialization.EnumMemberAttribute()]
		[OptionSetMetadataAttribute("Created (Active)", 0, "#0000ff")]
		Created_Active = 177740001,
		
		[System.Runtime.Serialization.EnumMemberAttribute()]
		[OptionSetMetadataAttribute("Renting (Active)", 2, "#0000ff")]
		Renting_Active = 177740003,
		
		[System.Runtime.Serialization.EnumMemberAttribute()]
		[OptionSetMetadataAttribute("Returned (Inactive)", 3, "#0000ff")]
		Returned_Inactive = 177740004,
	}
}