import * as _ from "lodash";
import { TypeDescription, Attribute, count_inheritance } from './type_traits.ts'

export function description_to_type_string(td: TypeDescription) {
    let result: string = `struct T |INHER|
{|DEF_CONST||MEM_FUNS||DATA_MEMS|
};`;

    let inheritance_count: number = count_inheritance(td)

    let replacings: Map<string, string> = new Map<string, string>([
        ['|INHER|', inheritance_fragment(td)],
        ['|DEF_CONST|', default_constructor_fragment(td, inheritance_count)],
        ['|MEM_FUNS|', virtual_member_functions_fragment(td)],
        ['|DATA_MEMS|', data_members_fragment(td)],
    ]);

    for(const [token, replacement] of replacings.entries())
        result = result.replace(token, replacement);

    return result;
}

function inheritance_fragment(td: TypeDescription) {
    let fragment : string = "";
    let inheritance_count : number = 0;

    function add_inheritance(keyword: string) {
        if(inheritance_count == 0)
        {
            fragment += ': ';
        }
        else
            fragment += ', ';

        ++inheritance_count;

        fragment += keyword + ' Base' + inheritance_count;
    }

    if(td.attributes[Attribute.HasPublicBaseClass])
        add_inheritance('public');
    if(td.attributes[Attribute.HasPrivateBaseClass])
        add_inheritance('private');
    if(td.attributes[Attribute.HasProtectedBaseClass])
        add_inheritance('protected');
    if(td.attributes[Attribute.HasVirtualBaseClass])
        add_inheritance('virtual');

    return fragment;
}

function default_constructor_fragment(td: TypeDescription, inherit_count : number) {
    let fragment : string = "";

    let count: number = 0;

    if(td.attributes[Attribute.HasUserProvidedDefaultConstr])
    {
        fragment += "\n    T() {}";
        ++count;
    }
    if(td.attributes[Attribute.HasInheritedDefaultConstr])
    {
        if(inherit_count == 0)
            throw new Error("Cannot inherit constructor without base");

        fragment += "\n    using Base1::Base1;";
        ++count;
    }
    if(td.attributes[Attribute.HasExplicitDefaultConstr])
    {
        fragment += "\n    explicit T() = default;";
        ++count;
    }

    if(count > 1)
        throw new Error("Default constructor should only be provided in one way");

    return fragment;
}

function virtual_member_functions_fragment(td: TypeDescription) {
    let fragment : string = "";

    if(td.attributes[Attribute.HasVirtualMf])
        fragment += "\n    virtual f();";

    return fragment;
}

function data_members_fragment(td: TypeDescription) {
    let fragment : string = "";

    if(td.attributes[Attribute.HasNsdmWithInitializer])
        fragment += "\n    int i = 0;";
    if(td.attributes[Attribute.HasReferenceNsdm])
        fragment += "\n    int& ir;";

    return fragment;
}
