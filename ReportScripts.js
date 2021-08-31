var Sdk = window.Sdk || {};
(
    function () {

        //If user selects Damage = yes, Damage description field should become required
        this.DamageOnChange = function (executionContext) {
            var formContext = executionContext.getFormContext();
            var fDamage = formContext.getAttribute("cr03e_damages").getValue();
            if (fDamage == 1) {
                var damageDescription = formContext.getAttribute("cr03e_damagedescription").setRequiredLevel("required");
            }
            else {
                var damageDescription = formContext.getAttribute("cr03e_damagedescription").setRequiredLevel("none");
            }
        }

    }

).call(Sdk);
