# Copyright (c) 2013, jan and contributors
# For license information, please see license.txt

import frappe
from calendar import monthrange
import datetime
def get_columns(filters):
	columns = [
		{"fieldname": "employee", "fieldtype": "Data", "width": "150"},
		{"label": "Name", "fieldname": "employee_staff_name", "fieldtype": "Data", "width": "150"},
		{"label": "Trade", "fieldname": "designation", "fieldtype": "Data", "width": "150"},
	]
	columns[0]['label'] = "EmpID" if filters.get("type") == "Employee" else "StaffID"
	return columns
def execute(filters=None):
	months = ['January', "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"]
	columns, data = get_columns(filters), []
	print(filters)
	months_no = " in ("
	month_no = ""
	if len(filters.get("month")) == 1:
		month_no += " = '" + str(months.index(filters.get("month")[0]) + 1) + "'"
	elif len(filters.get("month")) > 1:
		for i in filters.get("month"):
			if months_no[len(months_no) - 1] != "(":
				months_no += ","
			months_no += str((months.index(i) + 1))
		months_no += ")"
	final_months = month_no if len(filters.get("month")) == 1 else months_no if len(
		filters.get("month")) > 1 else " = '1'"

	num_days = monthrange(2019, 1)[1]
	condition = get_condition(filters)
	for i in range (1,num_days+1):
		columns.append({
			"label": str(i),
			"fieldname": str(i),
			"fieldtype": "Data",
			"width": "50",
		})
	columns.append({"label": "Total Hours", "fieldname": "total_hour", "fieldtype": "Data", "width": "100"},)
	columns.append({"label": "Rate Hours", "fieldname": "default_billing_rate_per_hour", "fieldtype": "Data", "width": "120"},)
	columns.append({"label": "No of Absent", "fieldname": "absent", "fieldtype": "Data", "width": "120"},)
	columns.append({"label": "Total Amount", "fieldname": "amount", "fieldtype": "Currency", "width": "120"},)
	columns.append({"label": "Deduction", "fieldname": "total_absent_deduction_per_hour", "fieldtype": "Currency", "width": "100"},)
	columns.append({"label": "PPE Deduction", "fieldname": "ppe_deduction", "fieldtype": "Currency", "width": "100"},)
	columns.append({"label": "Net Total", "fieldname": "net_total", "fieldtype": "Currency", "width": "120"},)
	columns.append({"label": "Total Ded", "fieldname": "total_ded", "fieldtype": "Currency", "width": "120","hidden":1},)
	# select_fields =
	types = [filters.get("type")] if filters.get("type") else ["Staff", "Employee"]
	for type in types:
		date_today = datetime.datetime.today()
		date_format = str(date_today.month) + "/" + str(date_today.day) + "/" + str(date_today.year)
		fields = get_fields(type)
		inner_join_filter = get_inner_join_filter(type)
		query = """ SELECT 
						{0}
					FROM `tab{1}` E 
					INNER JOIN `tabTimesy` T ON {2} = E.name
					INNER JOIN `tabStaffing Cost` SC ON SC.name = T.staffing_cost
					WHERE MONTH(T.end_date) {3} and YEAR(T.end_date) = '{4}' {5}""".format(fields,type,inner_join_filter,final_months,filters.get("fiscal_year"),condition)
		print(query)
		data += frappe.db.sql(query, as_dict=1)
		total_amount = total_absent = total_absent_deduction = total_ded = 0
		for x in data:
			print("xxxxxxxxxxxxxxxxxxxxxxxx")
			print(x)
			timesy_details = frappe.db.sql(""" SELECT DAY(date) as day_of_the_month, working_hour, status FROM `tabTimesy Details` WHERE parent=%s""", x.name, as_dict=1)
			ttl=0
			for m in filters.get("month"):
				s=0
				ded = frappe.db.sql("""select sum(c.amount) as amount from `tabTimesheeet Additional Supplier` as c inner join `tabTimesheet Additional` as p on 
				p.name = c.parent where c.supplier=%s and p.month=%s and p.fiscal_year=%s and c.type='Deduction' and p.docstatus=1""",(filters.get("supplier"),m,filters.get("fiscal_year")),as_dict=1)
				print("******************************************")
				if ded:
					if ded[0].amount:
						s = ded[0].amount
						ttl += s 
			sum = 0
			absent = 0
			for xx in timesy_details:
				if xx.working_hour == 0:
					if xx.status == "Absent":
						absent += 1
					x[str(xx.day_of_the_month)] = xx.status[0]
				else:
					sum += xx.working_hour
					x[str(xx.day_of_the_month)] = xx.working_hour
			print("SUMMMMM")
			print(sum)
			print(x.default_billing_rate_per_hour)
			x['total_hour'] = sum
			x['amount'] = x.default_billing_rate_per_hour * sum
			x['absent'] = absent
			x['total_absent_deduction_per_hour'] = absent * x.absent_deduction_per_hour
			if x.total_billing_rate_deduction:
				x['total_absent_deduction_per_hour'] = absent * x.absent_deduction_per_hour + x.total_billing_rate_deduction
			x['ppe_deduction'] = x.ppe_deduction
			x['net_total'] = x['amount'] - x['total_absent_deduction_per_hour']
			x['date_format'] = date_format
			x['total_ded'] = ttl
			total_amount += x['amount']
			total_absent += x['total_absent_deduction_per_hour']
			total_ded += x['total_ded']
			total_absent_deduction += absent * x.absent_deduction_per_hour + x.ppe_deduction +x.total_billing_rate_deduction
		if len(data) > 0:
			print('total')
			print(total_absent_deduction)
			data[len(data)-1]['total_amount'] = total_amount
			data[len(data)-1]['total_absent'] = total_absent
			data[len(data)-1]['subtotal_without_vat_1'] = total_amount - total_absent
			data[len(data)-1]['fifteen_percent'] =round((total_amount - total_absent_deduction) * 0.15,2)
			data[len(data)-1]['grand_total'] =round(((total_amount - total_absent_deduction) * 0.15),2) + (total_amount - total_absent_deduction)
			data[len(data)-1]['total_deduction'] =round(total_absent_deduction,2)
			data[len(data)-1]['total_ded'] =total_ded

	return columns, data

def get_condition(filters):
	condition = ""

	if filters.get("employee") and filters.get("type") == 'Employee':
		condition += " and E.name = '{0}'".format(filters.get("employee"))

	if len(filters.get("staff")) == 1 and filters.get("type") == 'Staff':

		condition += " and E.name = '{0}'".format(filters.get("staff")[0])

	elif len(filters.get("staff")) > 1 and filters.get("type") == 'Staff':

		condition += " and E.name in {0}".format(tuple(filters.get("staff")))

	if filters.get("type"):
		condition += " and T.reference_type = '{0}'".format(filters.get("type"))

	if filters.get("staffing_project"):
		condition += " and T.staffing_project = '{0}'".format(filters.get("staffing_project"))

	if filters.get('supplier'):
		condition += " and T.supplier = '{0}'".format(filters.get("supplier"))

	if filters.get('status') == 'Draft':
		print("test")
		condition += " and T.docstatus = 0"
	else:
		print("kajshdlajsdlkja")
		condition += " and T.status='{0}' and T.docstatus = 1".format(filters.get("status"))

	return condition

def get_fields(type):
	fields = ""
	if type == "Employee":
		fields = "T.employee_code as employee," \
				 "T.employee_name as employee_staff_name," \
				 "T.total_billing_rate_deduction," \
				 "E.designation,T.name," \
				 "SC.default_billing_rate_per_hour,T.ppe_deduction," \
				 "SC.absent_deduction_per_hour"
		print(fields)
	elif type == "Staff":
		fields = "T.staff_code as employee," \
				 "T.staff_name as employee_staff_name," \
				 "T.total_billing_rate_deduction," \
				 "E.designation,T.name,T.ppe_deduction," \
				 "SC.default_billing_rate_per_hour," \
				 "SC.absent_deduction_per_hour"
		print(fields)
	return fields

def get_inner_join_filter(type):
	return "T.employee_code" if type == 'Employee' else "T.staff_code"

