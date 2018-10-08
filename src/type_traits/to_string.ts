import * as _ from "lodash";
import { TypeDescription } from './type_traits.ts'

function inheritance_fragment(td: TypeDescription) {
    let fragment : string = "";
    let first : boolean = true;

    function add_inheritance(keyword: string, name: string) {
        if(first)
        {
            first = false;
            fragment += ': ';
        }
        else
            fragment += ', ';

        fragment += keyword + ' ' + name;
    }

    if(td.has_public_base_class)
        add_inheritance('public', 'PubBase');
    if(td.has_private_base_class)
        add_inheritance('private', 'PrivBase');
    if(td.has_protected_base_class)
        add_inheritance('protected', 'ProtBase');
    if(td.has_virtual_base_class)
        add_inheritance('virtual', 'VirtBase');

    return fragment;
}

export function description_to_type_string(td: TypeDescription) {
    let result: string = `struct T |INHER|
{
};`;

    let replacings: Map<string, string> = new Map<string, string>([
        ['|INHER|', inheritance_fragment(td)],
    ]);

    for(const [token, replacement] of replacings.entries())
        result = result.replace(token, replacement);

    return result;
}

    /*
    //constructors/destructors/etc
    has_user_provided_default_constr : boolean //explicitly defaulted or deleted does not count
    has_inherited_default_constr : boolean //constructors inherited like: using Base::Base;
    has_explicit_default_constr : boolean //constructor with 'explicit' before it, including if has = default/delete
    has_user_provided_copy_constr : boolean //explicitly defaulted or deleted does not count
    has_inherited_copy_constr : boolean //constructors inherited like: using Base::Base;
    has_explicit_copy_constr : boolean //constructor with 'explicit' before it, including if has = default/delete
    has_user_provided_move_constr : boolean //explicitly defaulted or deleted does not count
    has_inherited_move_constr : boolean //constructors inherited like: using Base::Base;
    has_explicit_move_constr : boolean //constructor with 'explicit' before it, including if has = default/delete
    has_deleted_constr : boolean //any constructor which is deleted explicitly
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
    has_initializer_needy_nsdm : boolean //a member that needs an initialiser and has none: 'const int' or 'int&'
    //methods
    has_virtual_mf : boolean //defines or inherits a member that is 'virtual'
     */
