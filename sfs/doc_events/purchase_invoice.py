import frappe,json
@frappe.whitelist()
def get_timesy_details(timesy_name):
    timesy_data = frappe.db.sql("""select * from `tabTimesy` where name=%s""",timesy_name,as_dict=1)
    if timesy_data:
        for i in timesy_data:
            if i.reference_type=="Staff":
                staff_data  = frappe.db.sql("""select * from `tabStaff` where name=%s""",i.staff_code,as_dict=1)
                s_id = {'staff_iqama_id' : staff_data[0].iqama_number}
                s_nation = {'staff_nationality':staff_data[0].nationality}
                i.update(s_id)
                i.update(s_nation)
                rate = frappe.db.get_value("Staffing Cost",{"staff_code":i.staff_code},"default_billing_rate_per_hour")
                r = {"hourly_rate":rate}
                i.update(r)

            if i.reference_type=="Employee":
                employee_data  = frappe.db.sql("""select * from `tabEmployee` where name=%s""",i.employee_code,as_dict=1)
                e_id = {'iqama_id' : employee_data[0].iqama_id}
                e_nation = {'nationality':employee_data[0].nationality}
                i.update(e_id)
                i.update(e_nation)

        return timesy_data
    


@frappe.whitelist()
def get_staffing(doctype, target,setters,d,e,filters):
    print("============================")
    print(doctype)
    print(target)
    print(setters)
    print(d)
    print(e)
    print(filters)
    data = []
    condition = ""
    if target:
        condition += " and (name like '%{0}%') ".format(target)

    if 'customer_name' in filters:
        condition += " and customer_name like '{0}' ".format(filters['customer_name'][1])

    if "staffing_type" in filters:
        condition += get_condition(filters)

    if "start_date" in filters:
        condition += " and start_date = '{0}' ".format(filters['start_date'])

    if "supplier_name" in filters:
        condition += " and supplier_name like '{0}' ".format(filters['supplier_name'][1])

    if "employee_name" in filters:
        condition += " and (employee_name like '{0}' or staff_name like '{1}') ".format(filters['employee_name'][1],filters['employee_name'][1])

    time_list = ""
    if "doctype" in filters:
        time_list += " and parenttype = '{0}'".format(filters['doctype'])

    print(condition)
    query = """ SELECT * FROM `tabTimesy` WHERE docstatus=1 and status='Completed' {0}""".format(condition)
    print(query)
    staffing = frappe.db.sql(query, as_dict=1)
    for i in staffing:
        check = frappe.db.sql(""" SELECT * FROm `tabTimesy List` WHERE timesy=%s {0}""".format(time_list), i.name, as_dict=1)
        if len(check) == 0:
            data.append({
                "name": i.name,
                "staffing_type": i.staffing_type,
                "employee_name": i.staff_name if i.reference_type == 'Staff' else i.employee_name,
                "customer_name": i.customer_name,
                "supplier_name": i.supplier_name,
                "start_date": i.start_date
            })
    print(data)
    return data

@frappe.whitelist()
def get_bulk_timesy(name):
    data = json.loads(name)
    timesies = []

    for j in data:
        timesies += frappe.db.sql(""" SELECT * FROM `tabTimesy` WHERE name=%s""", j, as_dict=1)
        if timesies:
            for i in timesies:
                if i.item:
                    item = frappe.db.sql("""select * from `tabItem` where name=%s""",i.item,as_dict=1)
                    i_name = {'item_name' : item[0].item_name}
                    i_uom = {'stock_uom':item[0].stock_uom}
                    i.update(i_name)
                    i.update(i_uom)

                if i.reference_type=="Staff":
                    staff_data  = frappe.db.sql("""select * from `tabStaff` where name=%s""",i.staff_code,as_dict=1)
                    s_id = {'staff_iqama_id' : staff_data[0].iqama_number}
                    s_nation = {'staff_nationality':staff_data[0].nationality}
                    i.update(s_id)
                    i.update(s_nation)
                    rate = frappe.db.get_value("Staffing Cost",{"staff_code":i.staff_code},"default_billing_rate_per_hour")
                    r = {"hourly_rate":rate}
                    i.update(r)

                if i.reference_type=="Employee":
                    employee_data  = frappe.db.sql("""select * from `tabEmployee` where name=%s""",i.employee_code,as_dict=1)
                    e_id = {'iqama_id' : employee_data[0].iqama_id}
                    e_nation = {'nationality':employee_data[0].nationality}
                    i.update(e_id)
                    i.update(e_nation)


    return timesies