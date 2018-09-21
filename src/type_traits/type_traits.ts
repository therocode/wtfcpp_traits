//Abbreviations:
// * nsdm - non-static data member
// * constr - constructor
interface TypeDescription {
    is_array_type : boolean // int[5] etc.  NOT std::array
    is_class_type : boolean // class/union/struct
    has_private_nsdm : boolean
    has_protected_nsdm : boolean
    has_user_provided_constr : boolean //explicitly defaulted or deleted does not count
    has_inherited_constr : boolean //constructors inherited like: using Base::Base;
    has_explicit_constr : boolean //any constructor with 'explicit' before it, including if they have = default/delete
    has_virtual_base_class : boolean //inherits with : virtual base
    has_private_base_class : boolean //inherits with : private base
    has_protected_base_class : boolean //inherits with : protected base
    has_virtual_member_function : boolean //defines or inherits a member that is 'virtual'
}

export function is_aggregate(td: TypeDescription): boolean {
    //https://en.cppreference.com/w/cpp/language/aggregate_initialization
    if(td.is_array_type) //array types are always aggregates
        return true;

    if(!td.is_class_type) //if it is neither array nor class type, it's not an aggregate
        return false;

    //fail criteria for class types to be aggregates:

    //no private or protected non-static data members
    if(td.has_private_nsdm || td.has_protected_nsdm)
        return false;

    //no user-provided, inherited, or explicit constructors (explicitly defaulted or deleted constructors are allowed)
    if(td.has_user_provided_constr || td.has_inherited_constr || td.has_explicit_constr)
        return false;

    //no virtual, private, or protected (since C++17) base classes
    if(td.has_virtual_base_class || td.has_private_base_class || td.has_protected_base_class)
        return false;

    //no virtual member functions
    if(td.has_virtual_member_function)
        return false;

    return true;
}

export function test() {

    let type_desc : TypeDescription = { 
        is_array_type : false,
        is_class_type : true,
        has_private_nsdm : false,
        has_protected_nsdm : false,
        has_user_provided_constr : false,
        has_inherited_constr : false,
        has_explicit_constr : false,
        has_virtual_base_class : false,
        has_private_base_class : false,
        has_protected_base_class : false,
        has_virtual_member_function : false,
    };

    console.log(`is_aggregate : ${ is_aggregate(type_desc) }`);

}
