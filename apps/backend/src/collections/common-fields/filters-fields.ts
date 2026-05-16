import { Field } from 'payload'

type GetFiltersFieldsArgs = {
  types?: string[]
}

export function getFiltersFields(options: GetFiltersFieldsArgs): Field[] {
  const typesField: Field | null =
    options.types && options.types.length > 0
      ? {
          name: 'type',
          type: 'select',
          options: options.types,
          required: true,
        }
      : null

  return [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    ...(typesField ? [typesField] : []),
  ]
}
