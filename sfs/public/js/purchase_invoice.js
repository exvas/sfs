frappe.ui.form.on("Purchase Invoice", {
    onload_post_render:function(frm){
        console.log("hi")
        if(frm.doc.timesy_list){
        if(frm.doc.timesy_list.length==1){
            if("confition")
            frappe.call({
                method:"sfs.doc_events.purchase_invoice.get_timesy_details",
                args:{
                   timesy_name : frm.doc.timesy_list[0].timesy 
                },
                callback:function(r){
                    if (r.message){
                        var data = r.message[0]
                        var t = frm.doc.items
                        for(var i =0 ;i<t.length;i++){
                            t[i].custom_reference_type=data.reference_type
                            t[i].custom_employee = data.employee_code
                            t[i].custom_staff = data.staff_code
                            t[i].custom_employee_name = data.employee_name
                            t[i].custom_staff_name = data.staff_name
                            t[i].custom_iqama_id = data.iqama_id
                            t[i].custom_staff_iqama_id = data.staff_iqama_id
                            t[i].custom_nationality = data.nationality
                            t[i].custom_staff_nationality = data.staff_nationality
                            t[i].custom_total_working_hour = data.total_working_hour
                            t[i].custom_hourly_rate = data.hourly_rate
                            t[i].qty = 1
                            t[i].rate = data.total_working_hour * data.hourly_rate
                            t[i].amount = data.total_working_hour * data.hourly_rate
                            t[i].custom_type = "Regular"
                            


                        }
                        console.log("77777")
                        frm.refresh_field("items")


                    }
                    
                }
            })
            



        }
        }
        console.log("yesssssssssss")
        


        cur_frm.add_custom_button(__('Fetch from Timesy'),
				function() {
                    var query_args = {
                       query:"sfs.doc_events.purchase_invoice.get_staffing",
                        filters: {doctype: cur_frm.doc.doctype}
                    }
					 var d = new frappe.ui.form.MultiSelectDialog({
                                doctype: "Timesy",
                                target: cur_frm,
                                setters: {
                                    staffing_type: "",
                                    employee_name: null,
                                    supplier_name: null,
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

    }
})




function add_items(selections, cur_frm) {
    frappe.call({
            method: "sfs.doc_events.purchase_invoice.get_bulk_timesy",
            args: {
                name: selections
            },
            callback: function (r) {
                if (!cur_frm.doc.items[0].item_code){
                    cur_frm.clear_table("items")
                }
                for(var x=0;x<r.message.length;x+=1){
                    cur_frm.add_child("items", {
                        "item_code":r.message[x].item,
                        "item_name":r.message[x].item,
                        "custom_reference_type":r.message[x].reference_type,
                        "custom_employee":r.message[x].employee_code,
                        "custom_staff":r.message[x].staff_code,           
                        "custom_employee_name":r.message[x].employee_name,
                        "custom_staff_name":r.message[x].staff_name,
                        "custom_iqama_id":r.message[x].iqama_id,
                        "custom_staff_iqama_id":r.message[x].staff_iqama_id,
                        "custom_nationality":r.message[x].nationality,
                        "custom_staff_nationality":r.message[x].staff_nationality,
                        "custom_total_working_hour":r.message[x].total_working_hour,
                        "custom_hourly_rate":r.message[x].hourly_rate,
                        "qty":1,
                        "rate":r.message[x].total_working_hour * r.message[x].hourly_rate,
                        "amount":r.message[x].total_working_hour * r.message[x].hourly_rate,
                        "custom_type":"Regular"
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