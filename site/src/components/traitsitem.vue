<template>
    <div>
        <p>{{ item_data.name }} - {{ item_data.is_true }} | {{ reason_string }} </p>
    </div>
</template>

<script>
import { Attribute } from 'type_traits/type_traits.ts'
export default {
    props: [
        'item_data',
    ],
    computed: {
        'reason_string': function () {
            let result = "";

            this.item_data.reasons.forEach(function(val, i) {
                if(val)
                {
                    result += Attribute[i] + " ";
                }
            });

            return result;
        },
    }
}
</script>
