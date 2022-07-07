import { Generated } from 'kysely'

interface WorkOrderTable {
    work_order_id: Generated<number>
    org_id: number
    xp_event_id: number
    client_work_order: string
    itsm_id: string
    kit_id: string
    peripheral_description: string
    employee_id: string
    runbook: string
    request_name: string
    request_type: string
    request_date: number
    request_fulfilled_date: number
    serial_number: string
    country: string
    expected_arrival_date: string
    shipping_carrier: string
    shipping_method: string
    shipping_status: string
    tracking_number: string
    delivery_date: number
    completion_date: number
    return_shipping_status: string
    return_tracking_number: string
    return_delivery_date: number
    signature_required: number
    weekend_delivery: number
    expidited: number
    last_modified: string
}

interface EventTable {
    event_id: Generated<number>
    company_id: number
    work_order_id: number
    requestor: string
    action: string
    event_key: string
    type: string
    event_date: number
    notes: string
    last_modified: string
}

interface IncidentTable {
    incident_id: Generated<number>
    org_id: number
    event_id: number
    action: string
    requestor: string
    updated_by: string
    closed_by: string
    priority: number
    acknowledged_by: string
    start_date: number
    end_date: number
    notes: string
    last_modified: string
    response: string
}

interface EventClassificationTable {
    event_id: number
    xp_event_id: number
    event_key: string
    short_desc: string
    long_desc: string
    category: string
    type: string
    action: string
    routine: string
    servo: string
    notes: string
    priority: number
    last_modified: string
}

interface PeopleTable {
    people_id: Generated<number>
    org_id: number
    address_id: number
    service_id: number
    access_id: number
    sam_account_name: string
    country_code: string
    site_name: string
    first_name: string
    last_name: string
    middle_name: string
    prefix: string
    suffix: string
    phone_number_mobile: string
    phone_number_home: string
    sms_allowed: boolean
    email_address_home: string
    email_address_work: string
    manager: string
    business_unit: string
    business_function: string
    organization_name: string
    position_title: string
    status: string
    last_modified: string
}

interface ChangeLogTable {
    change_log_id
    org_id
    change_log_type
    change_log_status
    entity_id
    record_id
    type_id
    log_detail
    last_modified: string
}

interface ChangeLogTypeTable {
    change_log_type_id
    change_log_type_name
}

interface ChangeLogStatusTable {
    change_log_status_id
    change_log_status_name
}

interface ItemTable {
    item_id: Generated<number>
    item_detail_id: number
    org_id
    entity_id
    service_id
    address: string
    status: string
    operational_status: string
    managed_by
    owned_by
    last_modified: string
}

interface ItemDetailTable {
    item_detail_id
    item_id
    org_id
    computer_name
    serial_number
    manufacturer
    model
    kit_id
    device_type
    warranty_end_date
    user
    email
    site_name
    location_type
    country_code
    country_name
    region
    business_unit
    function
    status
    last_logged_on
    os
    build
    contract
    processor_name
    drive_size
    drive_free_space
    total_memory_in_g
    last_modified: string
}

interface CountryTable {
    country_id: Generated<number>
    country_code: string
    country_name: string
    common_names_match: any
    country_currency: string
    fips_code: string
    iso_numeric: string
    north: number
    south: number
    east: number
    west: number
    latitude: number
    longitude: number
    capital: string
    continent_name: string
    continent: string
    languages: string
    iso_alpha3: string
    geoname_id: number
    last_modified: string
}

interface EventTypeTable {
    type_id: Generated<number>
    short_desc: string
    long_desc: string
    info_link: string
    notes: string
    last_modified: string
}

export interface Database {
    work_order: WorkOrderTable
    event: EventTable
    event_classification: EventClassificationTable
    incident: IncidentTable
    people: PeopleTable
    change_log: ChangeLogTable
    change_log_status: ChangeLogStatusTable
    change_log_type: ChangeLogTypeTable
    item: ItemTable
    item_detail: ItemDetailTable
    country: CountryTable
    type: EventTypeTable
}
