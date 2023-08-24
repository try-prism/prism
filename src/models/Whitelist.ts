/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-prototype-builtins */
/* eslint-disable unicorn/no-nested-ternary */
// To parse this data:
//
//   import { Convert, Whitelist } from "./file";
//
//   const whitelist = Convert.toWhitelist(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Whitelist {
  id: string;
  org_name: string;
  org_id: string;
  org_user_email: string;
  created_at: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toWhitelist(json: string): Whitelist {
    return cast(JSON.parse(json), r('Whitelist'));
  }

  public static whitelistToJson(value: Whitelist): string {
    return JSON.stringify(uncast(value, r('Whitelist')), undefined, 2);
  }
}

function invalidValue(typ: any, value: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw new Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
      value
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

function jsonToJSProperties(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProperties(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  value: any,
  typ: any,
  getProperties: any,
  key: any = '',
  parent: any = ''
): any {
  function transformPrimitive(typ: string, value_: any): any {
    if (typeof typ === typeof value_) return value_;
    return invalidValue(typ, value_, key, parent);
  }

  function transformUnion(typs: any[], value_: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let index = 0; index < l; index++) {
      const typ = typs[index];
      try {
        return transform(value_, typ, getProperties);
      } catch (error) {
        console.log(error);
      }
    }
    return invalidValue(typs, value_, key, parent);
  }

  function transformEnum(cases: string[], value_: any): any {
    if (cases.includes(value_)) return value_;
    return invalidValue(
      cases.map(a => {
        return l(a);
      }),
      value_,
      key,
      parent
    );
  }

  function transformArray(typ: any, value_: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(value_))
      return invalidValue(l('array'), value_, key, parent);
    return value_.map(element => transform(element, typ, getProperties));
  }

  function transformDate(value_: any): any {
    if (value_ === null) {
      return undefined;
    }
    const d = new Date(value_);
    if (Number.isNaN(d.valueOf())) {
      return invalidValue(l('Date'), value_, key, parent);
    }
    return d;
  }

  function transformObject(
    properties: { [k: string]: any },
    additional: any,
    value_: any
  ): any {
    if (
      value_ === null ||
      typeof value_ !== 'object' ||
      Array.isArray(value_)
    ) {
      return invalidValue(l(reference || 'object'), value_, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(properties).forEach(key => {
      const property = properties[key];
      const v = Object.prototype.hasOwnProperty.call(value_, key)
        ? value_[key]
        : undefined;
      result[property.key] = transform(
        v,
        property.typ,
        getProperties,
        key,
        reference
      );
    });
    Object.getOwnPropertyNames(value_).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(properties, key)) {
        result[key] = transform(
          value_[key],
          additional,
          getProperties,
          key,
          reference
        );
      }
    });
    return result;
  }

  if (typ === 'any') return value;
  if (typ === null) {
    if (value === null) return value;
    return invalidValue(typ, value, key, parent);
  }
  if (typ === false) return invalidValue(typ, value, key, parent);
  let reference: any = undefined;
  while (typeof typ === 'object' && typ.ref !== undefined) {
    reference = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, value);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, value)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, value)
      : typ.hasOwnProperty('props')
      ? transformObject(getProperties(typ), typ.additional, value)
      : invalidValue(typ, value, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof value !== 'number') return transformDate(value);
  return transformPrimitive(typ, value);
}

function cast<T>(value: any, typ: any): T {
  return transform(value, typ, jsonToJSProperties);
}

function uncast<T>(value: T, typ: any): any {
  return transform(value, typ, jsToJSONProperties);
}

function l(typ: any) {
  return { literal: typ };
}

function o(properties: any[], additional: any) {
  return { props: properties, additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Whitelist: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'org_name', js: 'org_name', typ: '' },
      { json: 'org_id', js: 'org_id', typ: '' },
      { json: 'org_user_email', js: 'org_user_email', typ: '' },
      { json: 'created_at', js: 'created_at', typ: '' },
    ],
    false
  ),
};
