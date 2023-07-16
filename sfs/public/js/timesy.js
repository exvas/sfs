frappe.ui.form.on("Timesy", {
    ppe_deduction:function(frm){
        ppe_deduction_calculation(cur_frm);
    }
})

function ppe_deduction_calculation(cur_frm){
    var ttl=0
    var deduction =0
    var ppe_ded =0
    var grand_total = 0
    if(cur_frm.doc.timesy_details){
        var table= cur_frm.doc.timesy_details
        for (var i=0;i<table.length;i++){
            ttl += table[i].costing_hour
            
        }

    }
    if(cur_frm.doc.total_costing_rate_deduction){
        deduction = cur_frm.doc.total_costing_rate_deduction
    }
    if(cur_frm.doc.ppe_deduction){
        ppe_ded = cur_frm.doc.ppe_deduction
    }
    grand_total = ttl - deduction - ppe_ded
    cur_frm.set_value("total_costing_hour",grand_total)
}