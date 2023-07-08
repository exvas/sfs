frappe.ui.form.on("Sales Invoice", {
    onload_post_render:function(frm){
        console.log("onload")
        if(cur_frm.doc.timesy_list){
            frappe.call({
                method: "sfs.doc_events.sales_invoice.get_timesy_dates",
                args: {
                    name:cur_frm.doc.timesy_list[0].timesy
                },
                callback: function (r) {
                    if(! cur_frm.doc.s_date){
                        cur_frm.set_value("s_date",r.message[0].start_date)
                        
                    }
                    if(! cur_frm.doc.e_date){
                        cur_frm.set_value("e_date",r.message[0].end_date)
                    }
                    if (cur_frm.doc.items){
                        var items = cur_frm.doc.items
                        for (var i=0;i<items.length;i++){
                            items[i].reference_type=r.message[0].reference_type
                            items[i].employee=r.message[0].employee_code

                            items[i].employee_name=r.message[0].employee_name
                            items[i].staff=r.message[0].staff_code

                            items[i].staff_name=r.message[0].staff_name

                            items[i].iqama_id=r.message[0].iq_id,
                            items[i].nationality=r.message[0].nation,
                            items[i].staff_iqama_id=r.message[0].s_iq_id,
                            items[i].staff_nationality=r.message[0].s_nation,
                            items[i].item_name=r.message[0].item_name,
                            items[i].uom=r.message[0].uom,
                            items[i].qty=1,
                            items[i].conversion_factor=1

                        }
                    }
                    
                }
            })
            
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
                            
                            add_dates(selections,cur_frm)
                            console.log("items")
                            get_items(selections,cur_frm)
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
                                    
                                    add_dates(selections,cur_frm)
                                    console.log("items")
                                    get_items(selections,cur_frm)
                                    d.dialog.hide()
                                }
                            });
        }, __("Get Items From"), "btn-default");
    }
    
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
    
    
    
function add_timesy(selections, cur_frm) {

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
                    add_dates(selections,cur_frm)
                    console.log("items")
                    get_items(selections,cur_frm)
                    compute_grand_costing(cur_frm)
                }
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
            name: selections
        },
        callback: function (r) {
            for(var i=0;i<cur_frm.doc.items.length;i+=1){
                if(!cur_frm.doc.items[i].item_code){
                    cur_frm.clear_table("items")
                }
            }
            for(var x=0;x<r.message.length;x+=1){
                cur_frm.add_child("items", {
                    item_code: r.message[x].item,
                    reference_type:r.message[x].reference_type,
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
                    conversion_factor:1
                })
                cur_frm.refresh_field("items")
                // compute_grand_costing(cur_frm)
            }
        }
    })
}