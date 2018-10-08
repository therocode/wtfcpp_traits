<template>
    <div>
        <h2>Type</h2>
        <pre>{{ type_string }}</pre>
    </div>
</template>

<script>
import { description_to_type_string } from 'type_traits/to_string.ts'
export default {
    props: [
        'type_description'
    ],
    computed: {
        'type_string': function () {
            return description_to_type_string(this.type_description);
        },
    },
}
</script>
