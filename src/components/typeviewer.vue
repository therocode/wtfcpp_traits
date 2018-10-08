<template>
    <div>
        <p>My description is: {{ type_description }}</p>
        <p>My string is: {{ type_string }}</p>
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
