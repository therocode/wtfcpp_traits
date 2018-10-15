<template>
    <div>
        <p>{{ item_data.name }} - {{ item_data.is_true }} | {{ reason_string }} </p>
    </div>
</template>

<script>
import { Attribute, CompoundAttribute, is_compount_attribute } from 'type_traits/type_traits.ts'
export default {
    props: [
        'item_data',
    ],
    computed: {
        'reason_string': function () {
            let result = "";

            this.item_data.reasons.forEach(function(val, i) {
                if(Array.isArray(val))
                {
                    console.log("was array");
                }
                else if(val)
                {
                    if(is_compount_attribute(i))
                    {
                        result += CompoundAttribute[i] + " ";
                    }
                    else
                    {
                        result += Attribute[i] + " ";
                    }
                }
            });

            return result;
        },
    }
}
</script>
