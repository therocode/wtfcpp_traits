<template>
    <div>
        <span class="trait-box">{{ item_data.name }} - {{ item_data.is_true }}</span><span class="trait-box">{{ reason_string }} </span>
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

<style scoped>
.trait-box {
  border-radius: 3px;

  background-color: #eee;
  padding: 0.7em 1em;
  margin-right: 0.5em;
  display:inline-block;margin-bottom: 0.5em;
}
</style>
