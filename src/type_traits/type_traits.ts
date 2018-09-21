import * as _ from "lodash";

//https://en.cppreference.com/w/cpp/language/type
enum Type {
    //fundamental types
    Void,
    NullptrT, //std::nullptr_t
    Arithmetic, //compound of [float, double, bool, ints, char, wchar_t] etc. NOT pointers
    //compound types
    Reference, //compound of l-value refs: [ref to object, ref to func] r-value refs: [ref to object, ref to func]
    Pointer, //compound of [pointer-to-object, pointer-to-member]
    Array, //int[5] etc. NOT std::array
    Function, // int int() const&  etc   NOT std::function or lambdas
    Enumeration, //enums
    Class, //class/union/struct
}

export function is_fundamental(t : Type): boolean {
    return _.includes([Type.Void, Type.NullptrT, Type.Arithmetic], t);
}

export function is_compound(t : Type): boolean {
    return !is_fundamental(t);
}

export function is_object(t: Type): boolean {
    return !_.includes([Type.Function, Type.Reference, Type.Void], t);
}

export function is_scalar(t: Type): boolean {
    return _.includes([Type.Arithmetic, Type.Pointer, Type.Enumeration, Type.NullptrT], t);
}

//Abbreviations:
// * nsdm - non-static data member
// * constr - constructor
// * mf - member function
interface TypeDescription {
    //type classification
    type_class : Type
    //constructors/destructors/etc
    has_user_provided_constr : boolean //explicitly defaulted or deleted does not count
    has_inherited_constr : boolean //constructors inherited like: using Base::Base;
    has_explicit_constr : boolean //any constructor with 'explicit' before it, including if they have = default/delete
    //inheritance
    has_trivial_base_class : boolean
    has_virtual_base_class : boolean //inherits with : virtual base
    has_private_base_class : boolean //inherits with : private base
    has_protected_base_class : boolean //inherits with : protected base
    //data members
    has_private_nsdm : boolean
    has_protected_nsdm : boolean
    has_nsdm_with_initializer : boolean
    has_non_trivial_nsdm : boolean
    //methods
    has_virtual_mf : boolean //defines or inherits a member that is 'virtual'
}

export function is_aggregate(td: TypeDescription): boolean {
    //https://en.cppreference.com/w/cpp/language/aggregate_initialization
    if(td.type_class == Type.Array) //array types are always aggregates
        return true;

    if(td.type_class != Type.Class) //if it is neither array nor class type, it's not an aggregate
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
    if(td.has_virtual_mf)
        return false;

    return true;
}

//--triviality--

//https://en.cppreference.com/w/cpp/language/default_constructor
export function is_trivially_constructible(td : TypeDescription): boolean {
    return !td.has_user_provided_constr &&  //not user provided  (implicit or defaulted is OK)
           !td.has_virtual_mf && //has no virtual member functions
           !td.has_virtual_base_class && //has no virtual base classes
           !td.has_nsdm_with_initializer &&//has no nsdm with default initialisers
            td.has_trivial_base_class && //every direct base of T is_trivially_constructible
           !td.has_non_trivial_nsdm;//every nsdm has trivial default constructor - 
}

export function test() {

    let type_desc : TypeDescription = { 
        type_class : Type.Class,
        has_user_provided_constr : false,
        has_inherited_constr : false,
        has_explicit_constr : false,
        has_trivial_base_class : false,
        has_virtual_base_class : false,
        has_private_base_class : false,
        has_protected_base_class : false,
        has_private_nsdm : false,
        has_protected_nsdm : false,
        has_nsdm_with_initializer : false,
        has_non_trivial_nsdm : false,
        has_virtual_mf : false,
    };

    console.log(`is_aggregate : ${ is_aggregate(type_desc) }`);

}
