<template>
    <div>
        <h2>Traits</h2>
        <p>std::is_aggregate: {{ is_aggregate }}</p>
    </div>
</template>

<script>
import { is_aggregate } from 'type_traits/type_traits.ts'

export default {
    props: [
        'type_description'
    ],
    computed: {
        'is_aggregate': function () {
            return is_aggregate(this.type_description);
        },
    },
}
</script>
