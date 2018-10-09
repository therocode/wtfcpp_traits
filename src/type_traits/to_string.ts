import * as _ from "lodash";
import { TypeDescription, Attribute } from './type_traits.ts'

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

    if(td.attributes[Attribute.HasPublicBaseClass])
        add_inheritance('public', 'PubBase');
    if(td.attributes[Attribute.HasPrivateBaseClass])
        add_inheritance('private', 'PrivBase');
    if(td.attributes[Attribute.HasProtectedBaseClass])
        add_inheritance('protected', 'ProtBase');
    if(td.attributes[Attribute.HasVirtualBaseClass])
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
