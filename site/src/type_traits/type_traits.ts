import * as _ from "lodash";

//https://en.cppreference.com/w/cpp/language/type
export enum Type {
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

export enum Attribute {
    //constructors/destructors/etc
    HasUserProvidedDefaultConstr,  //explicitly defaulted or deleted does not count
    HasInheritedDefaultConstr,  //constructors inherited like: using Base::Base;
    HasExplicitDefaultConstr,  //constructor with 'explicit' before it, including if has = default/delete
    HasUserProvidedCopyConstr,  //explicitly defaulted or deleted does not count
    HasInheritedCopyConstr,  //constructors inherited like: using Base::Base;
    HasExplicitCopyConstr,  //constructor with 'explicit' before it, including if has = default/delete
    HasUserProvidedMoveConstr,  //explicitly defaulted or deleted does not count
    HasInheritedMoveConstr,  //constructors inherited like: using Base::Base;
    HasExplicitMoveConstr,  //constructor with 'explicit' before it, including if has = default/delete
    HasDeletedConstr,  //any constructor which is deleted explicitly
    //inheritance
    //has_trivial_base_class,  *not gonna check*
    HasPublicBaseClass,  //inherits with : public base
    HasVirtualBaseClass,  //inherits with : virtual base
    HasPrivateBaseClass,  //inherits with : private base
    HasProtectedBaseClass,  //inherits with : protected base
    //data members
    HasPrivateNsdm, 
    HasProtectedNsdm, 
    HasNsdmWithInitializer, 
    HasNonTrivialNsdm, 
    HasInitializerNeedyNsdm,  //a member that needs an initialiser and has none: 'const int' or 'int&'
    //methods
    HasVirtualMf,  //defines or inherits a member that is 'virtual'
}

export enum CompoundAttribute {
    IsAggregate = Attribute.HasVirtualMf + 1,   //last entry of Attribute
    //constructors/destructors/etc
    HasUserProvidedConstr,
    HasInheritedConstr,
    HasExplicitConstr
}

export function is_compount_attribute(i : number){
    return i > Attribute.HasVirtualMf;
}

export type ReasonArray = any[];
export interface TraitResult  {
    is_true: boolean,
    reasons: ReasonArray,
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
export interface TypeDescription {
    //type classification
    type_class : Type
    attributes : boolean[]
    ////constructors/destructors/etc
    //has_user_provided_default_constr : boolean //explicitly defaulted or deleted does not count
    //has_inherited_default_constr : boolean //constructors inherited like: using Base::Base;
    //has_explicit_default_constr : boolean //constructor with 'explicit' before it, including if has = default/delete
    //has_user_provided_copy_constr : boolean //explicitly defaulted or deleted does not count
    //has_inherited_copy_constr : boolean //constructors inherited like: using Base::Base;
    //has_explicit_copy_constr : boolean //constructor with 'explicit' before it, including if has = default/delete
    //has_user_provided_move_constr : boolean //explicitly defaulted or deleted does not count
    //has_inherited_move_constr : boolean //constructors inherited like: using Base::Base;
    //has_explicit_move_constr : boolean //constructor with 'explicit' before it, including if has = default/delete
    //has_deleted_constr : boolean //any constructor which is deleted explicitly
    ////inheritance
    ////has_trivial_base_class : boolean *not gonna check*
    //has_public_base_class : boolean //inherits with : public base
    //has_virtual_base_class : boolean //inherits with : virtual base
    //has_private_base_class : boolean //inherits with : private base
    //has_protected_base_class : boolean //inherits with : protected base
    ////data members
    //has_private_nsdm : boolean
    //has_protected_nsdm : boolean
    //has_nsdm_with_initializer : boolean
    //has_non_trivial_nsdm : boolean
    //has_initializer_needy_nsdm : boolean //a member that needs an initialiser and has none: 'const int' or 'int&'
    ////methods
    //has_virtual_mf : boolean //defines or inherits a member that is 'virtual'
}

export function is_aggregate(td: TypeDescription): TraitResult {

    let result: TraitResult = {is_true: true, reasons: []};

    //https://en.cppreference.com/w/cpp/language/aggregate_initialization
    if(td.type_class == Type.Array) //array types are always aggregates
        result.is_true = true;

    if(td.type_class != Type.Class) //if it is neither array nor class type, it's not an aggregate
        result.is_true = false; //TODO: what reason here

    //fail criteria for class types to be aggregates:

    //no private or protected non-static data members
    result.reasons[Attribute.HasPrivateNsdm] = td.attributes[Attribute.HasPrivateNsdm];
    result.reasons[Attribute.HasProtectedNsdm] = td.attributes[Attribute.HasProtectedNsdm];

    //no user-provided, inherited, or explicit constructors (explicitly defaulted or deleted constructors are allowed)
    result.reasons[CompoundAttribute.HasUserProvidedConstr] = has_user_provided_constr(td);
    result.reasons[CompoundAttribute.HasInheritedConstr] = has_inherited_constr(td);
    result.reasons[CompoundAttribute.HasExplicitConstr] = has_explicit_constr(td);

    //no virtual, private, or protected (since C++17) base classes
    result.reasons[Attribute.HasVirtualBaseClass] = td.attributes[Attribute.HasVirtualBaseClass];
    result.reasons[Attribute.HasPrivateBaseClass] = td.attributes[Attribute.HasPrivateBaseClass];
    result.reasons[Attribute.HasProtectedBaseClass] = td.attributes[Attribute.HasProtectedBaseClass];

    //no virtual member functions
    result.reasons[Attribute.HasVirtualMf] = td.attributes[Attribute.HasVirtualMf];

    for(let entry of result.reasons)
        if(entry)
            result.is_true = false;

    return result;
}

export function has_user_provided_constr(td: TypeDescription) : boolean {
    return td.attributes[Attribute.HasUserProvidedDefaultConstr] ||
        td.attributes[Attribute.HasUserProvidedCopyConstr] ||
        td.attributes[Attribute.HasUserProvidedMoveConstr];
}

export function has_inherited_constr(td: TypeDescription) : boolean {
    return td.attributes[Attribute.HasInheritedDefaultConstr] ||
        td.attributes[Attribute.HasInheritedCopyConstr] ||
        td.attributes[Attribute.HasInheritedMoveConstr];
}

export function has_explicit_constr(td: TypeDescription) : boolean {
    return td.attributes[Attribute.HasExplicitDefaultConstr] ||
        td.attributes[Attribute.HasExplicitCopyConstr] ||
        td.attributes[Attribute.HasExplicitMoveConstr];
}

//https://en.cppreference.com/w/cpp/types/is_constructible
export function is_default_constructible(td: TypeDescription): boolean {
    if(!is_object(td.type_class)) //if it's not an object, bail
        return false;

    //all of these are always default constructible
    if(_.includes([Type.NullptrT, Type.Arithmetic, Type.Pointer, Type.Array, Type.Enumeration], td.type_class))
        return true;

    //if it is Type.Class, we have to elaborate - the constructor must not be deleted
    
    //TODO:
    return !td.attributes[Attribute.HasInitializerNeedyNsdm] && // no reference nsdm without init, no const nsdm without init
    // no non-default constructible nsdm - not tested
    // no non-default constructible bases - not tested
    // no non bases with inaccessible/deleted destructors - not tested
        !td.attributes[Attribute.HasDeletedConstr]; // no explicitly deleted constructor
}

//https://en.cppreference.com/w/cpp/language/default_constructor
export function is_trivially_default_constructible(td : TypeDescription): boolean {
    return is_default_constructible(td) &&
           !td.attributes[Attribute.HasUserProvidedDefaultConstr] &&  //not user provided  (implicit or defaulted is OK)
           !td.attributes[Attribute.HasVirtualMf] && //has no virtual member functions
           !td.attributes[Attribute.HasVirtualBaseClass] && //has no virtual base classes
           !td.attributes[Attribute.HasNsdmWithInitializer] &&//has no nsdm with default initialisers
           // td.has_trivial_base_class && //every direct base of T is_trivially_constructible *not gonna check*
           !td.attributes[Attribute.HasNonTrivialNsdm];//every nsdm has trivial default constructor - 
}

export function test() {

    let type_desc : TypeDescription = { 
        type_class : Type.Class,
        attributes : [],
    };

    console.log(`is_aggregate : ${ is_aggregate(type_desc) }`);

}

export function get_default_type_description() {

    let type_desc : TypeDescription = { 
        type_class : Type.Class,
        attributes : [],
    }

    return type_desc;
}

export function count_inheritance(td: TypeDescription) {
    let count: number = 0;
    if(td.attributes[Attribute.HasPublicBaseClass])
        ++count;
    if(td.attributes[Attribute.HasPrivateBaseClass])
        ++count;
    if(td.attributes[Attribute.HasProtectedBaseClass])
        ++count;
    if(td.attributes[Attribute.HasVirtualBaseClass])
        ++count;

    return count;
}
