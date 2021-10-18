/*
    Per-tenant schema
 */
export default {
    version: '0.0.1',
    indexes: {
        primary: { hash: 'pk', sort: 'sk' },
        gs1:     { hash: 'gs1pk', sort: 'gs1sk', project: 'all' },
    },
    models: {
        Account: {
            pk:         { type: String, value: '${_type}#${id}' },
            sk:         { type: String, value: '${_type}#' },
            id:         { type: String, uuid: true },
            name:       { type: String, required: true, unique: true },

            gs1pk:      { type: String, value: '${_type}#${name}' },
            gs1sk:      { type: String, value: '${_type}#' },
        },
        User: {
            pk:         { type: String, value: 'Account#${accountId}' },
            sk:         { type: String, value: '${_type}#${id}' },
            accountId:  { type: String, required: true },
            id:         { type: String, uuid: true },
            name:       { type: String, required: true },
            email:      { type: String, required: true },

            gs1pk:      { type: String, value: '${_type}#${email}' },
            gs1sk:      { type: String, value: '${_type}#${accountId}' },
        },
    } as const
}
