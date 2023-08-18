/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-prototype-builtins */
/* eslint-disable unicorn/no-nested-ternary */

// To parse this data:
//
//   import { Convert } from '@/models/Organization';
//
//   const organization = Convert.toOrganization(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// Generated by https://quicktype.io

export interface Organization {
  id: string;
  name: string;
  email: string;
  admin_id: string;
  user_list: string[];
  invited_user_list: string[];
  link_id_map: { [key: string]: IntegrationData };
  document_list: string[];
  created_at: string;
  updated_at: string;
}

export interface IntegrationData {
  created: string;
  integration: string;
  end_user_organization_name: string;
  end_user_email_address: string;
  id: string;
  category: string;
  is_duplicate: boolean;
  end_user_origin_id: string;
  integration_slug: string;
  status: string;
  webhook_listener_url: string;
  account_id: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toOrganization(json: any): Organization {
    return cast(json, r('Organization'));
  }

  public static OrganizationToJson(value: Organization): string {
    return JSON.stringify(uncast(value, r('Organization')), undefined, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw new Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
      val
    )}`
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    return typ.length === 2 && typ[0] === undefined
      ? `an optional ${prettyTypeName(typ[1])}`
      : `one of [${typ
          .map(a => {
            return prettyTypeName(a);
          })
          .join(', ')}]`;
  } else if (typeof typ === 'object' && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = '',
  parent: any = ''
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (error) {
        console.log(error);
      }
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.includes(val)) return val;
    return invalidValue(
      cases.map(a => {
        return l(a);
      }),
      val,
      key,
      parent
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return undefined;
    }
    const d = new Date(val);
    if (Number.isNaN(d.valueOf())) {
      return invalidValue(l('Date'), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue(l(ref || 'object'), val, key, parent);
    }
    const result: any = {};
    for (const key of Object.getOwnPropertyNames(props)) {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    }
    for (const key of Object.getOwnPropertyNames(val)) {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    }
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === 'object' && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Organization: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'name', js: 'name', typ: '' },
      { json: 'email', js: 'email', typ: '' },
      { json: 'admin_id', js: 'admin_id', typ: '' },
      { json: 'user_list', js: 'user_list', typ: a('') },
      { json: 'invited_user_list', js: 'invited_user_list', typ: a('') },
      { json: 'link_id_map', js: 'link_id_map', typ: m(r('IntegrationData')) },
      { json: 'document_list', js: 'document_list', typ: a('') },
      { json: 'created_at', js: 'created_at', typ: '' },
      { json: 'updated_at', js: 'updated_at', typ: '' },
    ],
    false
  ),
  IntegrationData: o(
    [
      { json: 'created', js: 'created', typ: '' },
      { json: 'integration', js: 'integration', typ: '' },
      {
        json: 'end_user_organization_name',
        js: 'end_user_organization_name',
        typ: '',
      },
      { json: 'end_user_email_address', js: 'end_user_email_address', typ: '' },
      { json: 'id', js: 'id', typ: '' },
      { json: 'category', js: 'category', typ: '' },
      { json: 'is_duplicate', js: 'is_duplicate', typ: true },
      { json: 'end_user_origin_id', js: 'end_user_origin_id', typ: '' },
      { json: 'integration_slug', js: 'integration_slug', typ: '' },
      { json: 'status', js: 'status', typ: '' },
      { json: 'webhook_listener_url', js: 'webhook_listener_url', typ: '' },
      { json: 'account_id', js: 'account_id', typ: '' },
    ],
    false
  ),
};
