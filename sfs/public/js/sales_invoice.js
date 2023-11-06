frappe.ui.form.on("Sales Invoice", {
    onload_post_render:function(frm){
        console.log("onload")
        if (frm.doc.new_doc==0){
            if(cur_frm.doc.timesy_list && cur_frm.doc.company){
                frappe.call({
                    method: "sfs.doc_events.sales_invoice.get_timesy_dates",
                    args: {
                        name:cur_frm.doc.timesy_list[0].timesy,
                        company:cur_frm.doc.company
                    },
                    callback: function (r) {
                        if(! cur_frm.doc.s_date){
                            cur_frm.set_value("s_date",r.message[0].start_date)
                            
                        }
                        console.log("onload woking")
                        cur_frm.set_value("additional_amount",r.message[0].charge_amount)
                        if(! cur_frm.doc.e_date){
                            cur_frm.set_value("e_date",r.message[0].end_date)
                        }
                        if (cur_frm.doc.items && cur_frm.doc.hourly_invoice==0){
                            var items = cur_frm.doc.items
                            for (var i=0;i<items.length;i++){
                                items[i].reference_type=r.message[0].reference_type
                                items[i].employee=r.message[0].employee_code

                                items[i].employee_name=r.message[0].employee_name
                                items[i].staff=r.message[0].staff_code
                                items[i].custom_timesy = r.message[0].name
                                items[i].staff_name=r.message[0].staff_name

                                items[i].iqama_id=r.message[0].iq_id,
                                items[i].nationality=r.message[0].nation,
                                items[i].staff_iqama_id=r.message[0].s_iq_id,
                                items[i].staff_nationality=r.message[0].s_nation,
                                items[i].item_name=r.message[0].item_name,
                                items[i].uom=r.message[0].uom,
                                items[i].qty=1,
                                items[i].rate=r.message[0].price_list_rate,
                                items[i].timesy_rate=r.message[0].total_costing_rate_before_deduction,
                                items[i].amount=r.message[0].price_list_rate*1,
                                items[i].total_working_hour=r.message[0].total_working_hour,
                                items[i].conversion_factor=1,
                                items[i].description=r.message[0].description,
                                items[i].income_account = r.message[0].income_account,
                                items[i].hourly_rate = r.message[0].hourly_rate


                            }
                        }
                        if (cur_frm.doc.items && cur_frm.doc.hourly_invoice==1){
                            var items = cur_frm.doc.items
                            for (var i=0;i<items.length;i++){
                                items[i].reference_type=r.message[0].reference_type
                                items[i].employee=r.message[0].employee_code

                                items[i].employee_name=r.message[0].employee_name
                                items[i].staff=r.message[0].staff_code

                                items[i].staff_name=r.message[0].staff_name
                                items[i].custom_timesy = r.message[0].name
                                items[i].iqama_id=r.message[0].iq_id,
                                items[i].nationality=r.message[0].nation,
                                items[i].staff_iqama_id=r.message[0].s_iq_id,
                                items[i].staff_nationality=r.message[0].s_nation,
                                items[i].item_name=r.message[0].item_name,
                                items[i].uom=r.message[0].uom,
                                items[i].qty=1,
                                items[i].hourly_rate = r.message[0].hourly_rate,
                                items[i].rate=r.message[0].total_costing_rate_before_deduction,
                                items[i].timesy_rate=r.message[0].total_costing_rate_before_deduction,
                                items[i].amount=r.message[0].total_costing_rate_before_deduction * items[i].qty,
                                items[i].total_working_hour=r.message[0].total_working_hour,
                                items[i].conversion_factor=1,
                                items[i].description=r.message[0].description,
                                items[i].income_account = r.message[0].income_account
                               


                            }
                        }
                        
                    }
                })
            }
            
        }
        cur_frm.add_custom_button(__('Timesy'),
        function() {
            var query_args = {
                query:"sfs.doc_events.sales_invoice.get_staffing",
                filters: {
        doctype: cur_frm.doc.doctype
                }
            }
                var d = new frappe.ui.form.MultiSelectDialog({
                        doctype: "Timesy",
                        target: cur_frm,
                        setters: {
                            staffing_type: "",
                            customer_name: null,
                            employee_name: null,
                            start_date: null,
                        },
                        date_field: "start_date",
                        get_query() {
                            return query_args;
                        },
                        action(selections) {
                            console.log(selections)
                            console.log("sfs executed")
                            add_timesy(selections, cur_frm)
                            console.log("dates")
                            
                            // add_dates(selections,cur_frm)
                            // console.log("items")
                            // get_items(selections,cur_frm)
                            d.dialog.hide()
                        }
                    });
    }, __("Get Items From"), "btn-default");

    },
    refresh: function () {
        console.log('done')
        frappe.call({
            method: "sfs.doc_events.sales_invoice.get_timesies",
            args: {doctype: "Sales Invoice"},
            callback: function (r) {
                cur_frm.set_query("timesy","timesy_list", () => {
                    return {
                        filters: [
                            ["name", "not in", r.message],
                            ["status", "=", "Completed"],
                            ["docstatus", "=", 1],
                        ]
                    }
                })
            }
        })


        
        cur_frm.add_custom_button(__('Fetch from Timesy'),
				function() {
                    console.log("hiiiii ranju")
                    console.log(cur_frm.doc.customer_name)
                    var query_args = {
                       query:"sfs.doc_events.sales_invoice.get_staffing",
                        // filters: {doctype: cur_frm.doc.doctype}
                    }
					 var d = new frappe.ui.form.MultiSelectDialog({
                                doctype: "Timesy",
                                target: cur_frm,
                                setters: {
                                    staffing_type: "",
                                    employee_name: null,
                                    customer_name: cur_frm.doc.customer_name,
                                    start_date: null,
                                },
                                date_field: "start_date",
                                get_query() {
                                    return query_args;
                                },
                                action(selections) {
                                    add_items(selections, cur_frm)
                                    d.dialog.hide()
                                }
                            });
        }, __("Get Items From"), "btn-default");



        cur_frm.add_custom_button(__('Timesy'),
                function() {
                    var query_args = {
                        query:"sfs.doc_events.sales_invoice.get_staffing",
                        filters: {
                doctype: cur_frm.doc.doctype,
                        }
                    }
                        var d = new frappe.ui.form.MultiSelectDialog({
                                doctype: "Timesy",
                                target: cur_frm,
                                setters: {
                                    staffing_type: "",
                                    customer_name: null,
                                    employee_name: null,
                                    start_date: null,
                                },
                                date_field: "start_date",
                                get_query() {
                                    return query_args;
                                },
                                action(selections) {
                                    console.log(selections)
                                    console.log("sfs executed")
                                    add_timesy(selections, cur_frm)
                                    console.log("dates")
                                    
                                    add_dates(selections,cur_frm)
                                    console.log("items")
                                    get_items(selections,cur_frm)
                                    d.dialog.hide()
                                }
                            });
        }, __("Get Items From"), "btn-default");
    },
    hourly_invoice:function(frm){
        if(cur_frm.doc.hourly_invoice==1){
            var items = cur_frm.doc.items
            for(var i=0 ; i<items.length ; i++){
                let r = items[i].hourly_rate*items[i].total_working_hour
                items[i].rate = r
                items[i].amount = r * items[i].qty

            }
            cur_frm.refresh_field("items")
        }
        if(cur_frm.doc.hourly_invoice==0){
            var items = cur_frm.doc.items
            for(var i=0 ; i<items.length ; i++){
                let r =0
                r = items[i].price_list_rate
                items[i].rate = r
                if (r){
                items[i].amount = r * items[i].qty
                }
                else{
                    items[i].amount =0

                }

            }
            cur_frm.refresh_field("items")

        }
    },
    validate:function(frm){
        frm.set_value("new_doc",1)
    }
    
})

frappe.ui.form.on("Sales Invoice Item", {
    total_working_hour:function(frm,cdt,cdn){
        var d = locals[cdt][cdn]
        if(cur_frm.doc.hourly_invoice==1){
            if (d.hourly_rate){
                d.rate = d.total_working_hour * d.hourly_rate
                d.amount = (d.hourly_rate * d.total_working_hour)*d.qty
            }
            cur_frm.refresh_field("items")
            total_cal(cur_frm)

        }
    },
    hourly_rate:function(frm,cdt,cdn){
        var d = locals[cdt][cdn]
        if(cur_frm.doc.hourly_invoice==1){
            if (d.total_working_hour){
                d.rate = d.hourly_rate * d.total_working_hour
                d.amount = (d.hourly_rate * d.total_working_hour)*d.qty
            }
            cur_frm.refresh_field("items")
            total_cal(cur_frm)

        }
    },

})
frappe.ui.form.on("Timesy List", {
    timesy_list_remove: function () {
        compute_grand_costing(cur_frm)
    },
    timesy: function (frm, cdt, cdn) {

        var d = locals[cdt][cdn]
        if(d.timesy){
        frappe.db.get_doc("Timesy",d.timesy)
            .then(t => {
                d.staff_name = t.reference_type === 'Staff' ? t.staff_name : t.employee_name
                cur_frm.refresh_field(d.parentfield)
            compute_grand_costing(cur_frm)
        })
        }

    }
})
    
function total_cal(cur_frm){
    var docs = cur_frm.doc.items
    var total = 0
    for (var i=0;i<docs.length;i++){
        total += docs[i].amount 
    }
    cur_frm.set_value("total",total)
} 
    
function add_timesy(selections, cur_frm) {
        if(!cur_frm.doc.company){
            frappe.throw("Please select the Company first")
        }
        frappe.call({
            method: "sfs.doc_events.sales_invoice.get_timesy",
            args: {
                name: selections
            },
            callback: function (r) {
                console.log("yess.................")
                for(var x=0;x<r.message.length;x+=1){
                    cur_frm.add_child("timesy_list", {
                        timesy: r.message[x].name,
                        staff_name: r.message[x].staff_name,
                        staffing_project: r.message[x].staffing_project,
                        total_costing_rate: r.message[x].total_costing_hour,
                    })
                    cur_frm.refresh_field("timesy_list")
                    
                    
                    compute_grand_costing(cur_frm)
                }
                var d = 0
                for(var x=0;x<r.message.length;x+=1){
                    d += r.message[x].total_deduction
                }
                var a = 0
                for(var s=0;s<r.message.length;s+=1){
                    a += r.message[s].charge_amount
                }
                cur_frm.set_value("discount_amount",d)
                console.log("aaaaaa")
                console.log(a)
                cur_frm.set_value("additional_amount",a)

                add_dates(selections,cur_frm)
                console.log("items")
                get_items(selections,cur_frm)
            }
        })
}
function check_items(item, cur_frm) {
        for(var x=0;x<cur_frm.doc.items.length;x+=1){
            var item_row = cur_frm.doc.items[x]
            if(item_row.item_code === item){
                item_row.qty += 1
                cur_frm.refresh_field("items")
                return true
            }
        }
        return false
}
function compute_grand_costing(cur_frm) {
    var total = 0
    for(var x=0;x<cur_frm.doc.timesy_list.length;x+=1){
        total += cur_frm.doc.timesy_list[x].total_costing_rate
    }
    cur_frm.doc.grand_costing_rate = total
    cur_frm.refresh_field("grand_costing_rate")
    if(cur_frm.doc.items.length > 0){
        cur_frm.doc.items[cur_frm.doc.items.length - 1].rate = total
        cur_frm.refresh_field('items')
    }
}
function add_dates(selections, cur_frm) {

    frappe.call({
        method: "sfs.doc_events.sales_invoice.get_dates",
        args: {
            name: selections
        },
        callback: function (r) {
            console.log("rrrrrrrrrrrr")
            console.log(r.message)
            cur_frm.set_value("s_date",r.message[0].start_date)
            cur_frm.set_value("e_date",r.message[0].end_date)

        }
    })
}


function get_items(selections, cur_frm) {
    console.log("get items")
    frappe.call({
        method: "sfs.doc_events.sales_invoice.get_item_details",
        args: {
            name: selections,
            company:cur_frm.doc.company
        },
        callback: function (r) {
            console.log("hiiii")
            console.log(r.message)
            for(var i=0;i<cur_frm.doc.items.length;i+=1){
                if(!cur_frm.doc.items[i].item_code){
                    cur_frm.clear_table("items")
                }
            }
            cur_frm.set_value("hourly_invoice",1)
            for(var x=0;x<r.message.length;x+=1){
                cur_frm.add_child("items", {
                    item_code: r.message[x].item,
                    description:r.message[x].description,
                    reference_type:r.message[x].reference_type,
                    custom_timesy:r.message[x].name,
                    staff:r.message[x].staff_code,
                    staff_name:r.message[x].staff_name,
                    employee:r.message[x].employee_code,
                    employee_name:r.message[x].employee_name,
                    iqama_id:r.message[x].iq_id,
                    nationality:r.message[x].nation,
                    staff_iqama_id:r.message[x].s_iq_id,
                    staff_nationality:r.message[x].s_nation,
                    item_name:r.message[x].item_name,
                    uom:r.message[x].uom,
                    qty:1,
                    rate:r.message[x].total_working_hour*r.message[x].price_list_rate,
                    timesy_rate:r.message[x].total_costing_hour,
                    amount:r.message[x].total_working_hour*r.message[x].price_list_rate*1,
                    total_working_hour:r.message[x].total_working_hour,
                    conversion_factor:1,
                    income_account:r.message[x].income_account,
                    hourly_rate:r.message[x].hourly_rate
                })
                cur_frm.refresh_field("items")
                // compute_grand_costing(cur_frm)
            }
        }
    })
}



function add_items(selections, cur_frm) {
    console.log("working add items")
    frappe.call({
            method: "sfs.doc_events.sales_invoice.get_bulk_timesy",
            args: {
                name: selections
            },
            callback: function (r) {
                if (!cur_frm.doc.items[0].item_code){
                    cur_frm.clear_table("items")
                }
                for(var x=0;x<r.message.length;x+=1){
                    console.log("super 999999999")
                    console.log(r.message[x].description)
                    cur_frm.add_child("items", {
                        "item_code":r.message[x].item,
                        "item_name":r.message[x].item_name,
                        "description":r.message[x].description,
                        "income_account":r.message[x].income_account,
                        "uom":r.message[x].stock_uom,
                        "custom_timesy":r.message[x].name,
                        "reference_type":r.message[x].reference_type,
                        "employee":r.message[x].employee_code,
                        "staff":r.message[x].staff_code,           
                        "employee_name":r.message[x].employee_name,
                        "staff_name":r.message[x].staff_name,
                        "iqama_id":r.message[x].iqama_id,
                        "staff_iqama_id":r.message[x].staff_iqama_id,
                        "nationality":r.message[x].nationality,
                        "staff_nationality":r.message[x].staff_nationality,
                        "total_working_hour":r.message[x].total_working_hour,
                        "hourly_rate":r.message[x].hourly_rate,
                        "qty":1,
                        "rate":r.message[x].total_working_hour * r.message[x].hourly_rate,
                        "amount":r.message[x].total_working_hour * r.message[x].hourly_rate,
                        "timesy_rate":r.message[x].total_costing_rate_before_deduction,
                        "type":"Regular"
                         })
                    cur_frm.refresh_field("items")
                    total_calculation(cur_frm);
                   
                }
            }
        })
}



function total_calculation(cur_frm){
    var table = cur_frm.doc.items
    var total = 0
    var t_qty = 0
    for (var i =0 ;i<table.length;i++){
        if(table[i].amount){
            total += table[i].amount
            t_qty += table[i].qty
            
        }
    }
    cur_frm.set_value("total_qty",t_qty)
    cur_frm.set_value("total",total)
    if(cur_frm.doc.total_taxes_and_charges){
        cur_frm.set_value("grand_total",total+cur_frm.doc.total_taxes_and_charges)
        cur_frm.set_value("rounded_total",total+cur_frm.doc.total_taxes_and_charges)
    }
    else{
        cur_frm.set_value("grand_total",total)
        cur_frm.set_value("rounded_total",total)
    }
    


}