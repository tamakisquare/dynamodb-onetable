/*
    typescript-tenant.ts -
 */
import {AWS, Client, Entity, Match, Table, print, dump, delay} from './utils/init'
import {TenantSchema} from './schemas'

// jest.setTimeout(7200 * 1000)

const table = new Table({
    name: 'TypescriptTenantTestTable',
    client: Client,
    schema: TenantSchema,
    uuid: 'ulid',
})
const accountId = table.uuid()

test('Create Table', async() => {
    if (!(await table.exists())) {
        await table.createTable()
        expect(await table.exists()).toBe(true)
    }
})

type UserType = Entity<typeof TenantSchema.models.User>
let User = table.getModel<UserType>('User')
let user: UserType = null

type AccountType = Entity<typeof TenantSchema.models.Account>
let Account = table.getModel<AccountType>('Account')
let account: AccountType = null

let userData = [
    {accountId: null, name: 'Peter Smith', email: 'peter@example.com' },
    {accountId: null, name: 'Patty O\'Furniture', email: 'patty@example.com' },
    {accountId: null, name: 'Cu Later', email: 'cu@example.com' },
]

test('Create Account', async() => {
    account = await Account.create({name: 'Acme Rockets'})
    expect(account).toMatchObject({name: 'Acme Rockets'})

    table.setContext({accountId: account.id})
    expect(table.getContext()).toMatchObject({accountId: account.id})
})

test('Create Users', async() => {
    for (let item of userData) {
        item.accountId = accountId
        await User.create(item)
    }
    let users = await User.scan()
    expect(users.length).toBe(userData.length)
})

test('Fetch', async() => {
    let items = await table.queryItems({pk: `Account#${account.id}`}, {parse: true, hidden: true})
    let collection = table.groupByType(items)
    expect(collection.Account.length).toBe(1)
    expect(collection.User.length).toBe(userData.length)
})

test('Fetch', async() => {
    let collection = await table.fetch(['Account', 'User'], {pk: `Account#${account.id}`})
    expect(collection.Account.length).toBe(1)
    expect(collection.User.length).toBe(userData.length)
})

test('Destroy Table', async() => {
    await table.deleteTable('DeleteTableForever')
    expect(await table.exists()).toBe(false)
})
