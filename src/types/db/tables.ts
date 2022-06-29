import { Generated } from 'kysely'

interface WorkOrderTable {
    work_order_id: Generated<number>
    org_id: number
    xp_event_id: number
    client_work_order: string
    itsm_id: string
    kit_id: string
    periperal_description: string
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
    last_modified: number
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
    last_modified: number
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
    last_modified: number
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
    last_modified: number
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
    last_modified
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
    item_id
    item_detail_id
    org_id
    entity_id
    service_id
    address
    status
    operational_status
    managed_by
    owned_by
    last_modified
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
    last_modified
}

export interface Database {
    workOrder: WorkOrderTable
    event: EventTable
    incident: IncidentTable
    people: PeopleTable
    changeLog: ChangeLogTable
    changeLogStatus: ChangeLogStatusTable
    changeLogType: ChangeLogTypeTable
    item: ItemTable
    itemDetail: ItemDetailTable
}
