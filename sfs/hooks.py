from . import __version__ as app_version

app_name = "sfs"
app_title = "Sfs"
app_publisher = "Cont. Est.sammish"
app_description = "Sattam Farhan Al Shammari"
app_email = "sammish.thundiyil@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/sfs/css/sfs.css"
# app_include_js = "/assets/sfs/js/sfs.js"

# include js, css files in header of web template
# web_include_css = "/assets/sfs/css/sfs.css"
# web_include_js = "/assets/sfs/js/sfs.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "sfs/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
#	"methods": "sfs.utils.jinja_methods",
#	"filters": "sfs.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "sfs.install.before_install"
# after_install = "sfs.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "sfs.uninstall.before_uninstall"
# after_uninstall = "sfs.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "sfs.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
#	"*": {
#		"on_update": "method",
#		"on_cancel": "method",
#		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
#	"all": [
#		"sfs.tasks.all"
#	],
#	"daily": [
#		"sfs.tasks.daily"
#	],
#	"hourly": [
#		"sfs.tasks.hourly"
#	],
#	"weekly": [
#		"sfs.tasks.weekly"
#	],
#	"monthly": [
#		"sfs.tasks.monthly"
#	],
# }

# Testing
# -------

# before_tests = "sfs.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#	"frappe.desk.doctype.event.event.get_events": "sfs.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "sfs.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["sfs.utils.before_request"]
# after_request = ["sfs.utils.after_request"]

# Job Events
# ----------
# before_job = ["sfs.utils.before_job"]
# after_job = ["sfs.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
#	{
#		"doctype": "{doctype_1}",
#		"filter_by": "{filter_by}",
#		"redact_fields": ["{field_1}", "{field_2}"],
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_2}",
#		"filter_by": "{filter_by}",
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_3}",
#		"strict": False,
#	},
#	{
#		"doctype": "{doctype_4}"
#	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"sfs.auth.validate"
# ]
fixtures = [
    {
        "doctype": "Custom Field",
        "filters": [
            [
                "name",
                "in",
                [
                    "Employee-nationality",
                    "Employee-column_break_p64v8",
                    "Employee-iqama_expiry_date",
                    "Employee-iqama_id",
                    "Quotation Item-employee",
                    "Quotation Item-employee_name",
                    "Quotation Item-iqama_id",
                    "Quotation Item-nationality",
                    "Sales Order Item-employee",
                    "Sales Order Item-employee_name",
                    "Sales Order Item-iqama_id",
                    "Sales Order Item-nationality",
                    "Sales Invoice Item-employee",
                    "Sales Invoice Item-employee_name",
                    "Sales Invoice Item-iqama_id",
                    "Sales Invoice Item-nationality",
                    "Sales Invoice-s_date",
                    "Sales Invoice-e_date",
                    "Company-address_details",
                    "Company-address_detail",
                    "Company-company_name_in_arabic",
                    "Company-column_break_swag3",
                    "Company-cr_no",
                    "Customer-cr_no",
                    "Sales Invoice-in_words_in_arabic",
                    "Sales Invoice-bank_details",
                    "Sales Invoice-bank",
                    "Sales Invoice-account_name",
                    "Sales Invoice-bank_name",
                    "Sales Invoice-column_break_vyb2j",
                    "Sales Invoice-branch_name",
                    "Sales Invoice-account_number",
                    "Sales Invoice-iban_number",
                    "Sales Invoice Item-hours",
                    "Quotation Item-type",
                    "Sales Order Item-type",
                    "Sales Invoice Item-type",
                    "Quotation-subject",

				]
			]
		]
	},
	# {
	# 	"doctype": "Property Setter",
	# 	"filters": [
	# 		[
	# 			"name",
	# 			"in",
	# 			[
	# 				"Sales Invoice Item-rate-label",
	# 				"Purchase Invoice Item-rate-label",
	# 			]
	# 		]
	# 	]
	# }
]