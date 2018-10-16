<template>
    <div>
        <input type="checkbox" :id="id" v-model="type_description.attributes[type_attribute]">
        <label :for="id">{{ label }}</label>
    </div>
</template>

<script>
export default {
    props: [
        'type_description',
        'type_attribute',
        'label',
        'id',
    ],
    watch: {
        ticked: {
            handler (val) {
                this.type_description.attributes[this.type_attribute] = val;
            },
        }
    }
}
</script>
