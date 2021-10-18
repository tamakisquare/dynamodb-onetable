/*
    Schema with validations
 */

import {Match} from '../utils/init'

export default {
    version: '0.0.1',
    format: 'onetable:1.0.0',
    indexes: {
        primary: { hash: 'pk', sort: 'sk' },
    },
    models: {
        User: {
            pk:         { type: String, value: 'user#${id}' },
            sk:         { type: String, value: 'user#' },
            id:         { type: String, uuid: 'ulid', validate: Match.ulid },
            name:       { type: String, required: true, validate: Match.name },
            email:      { type: String, required: true, validate: Match.email },
            address:    { type: String, validate: Match.address },

            //  Literal string validation
            city:       { type: String, validate: 'San Francisco' },

            //  String regexp

            zip:        { type: String, validate: '/^[a-z0-9 ,.-]+$/' },
            phone:      { type: String, validate: (model, field, value) => {
                            if (!value.match(Match.phone)) {
                                return {error: 'Invalid phone number'}
                            }
                            return {value}
                        }
            },
            status:     { type: String, required: true },
            age:        { type: Number },
        }
    }
}
