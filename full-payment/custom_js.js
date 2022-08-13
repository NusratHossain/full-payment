// testing comment from home
// conflict will happen here
// 2nd commit
// 3rd commit
// test comment test comment
function update_gl_entry(frm) {
	let currency = frm.doc.currency;
	let paid_amount_selected_currency = frm.doc.paid_amount_selected_currency;
	let pe_name = frm.doc.name;

	if (paid_amount_selected_currency && pe_name) {
		frappe.call({
			method: "erpnext.accounts.doctype.payment_entry.api.get_gl_entry",
			args: {
				pe_name: pe_name
			}
		}).done((r) => {
			$.each(r.message, function (index, row) {
				if (row.debit && row.account == frm.doc.paid_to) {
					frappe.call({
						method: "erpnext.accounts.doctype.payment_entry.api.twist_gl_entry_debit",
						args: {
							paid_amount_selected_currency: paid_amount_selected_currency,
							n: row.name,
							currency: currency
						},
					}).done((r) => {
						// console.log("r(inner1)", r);
					});

				} else if (row.credit && row.account == frm.doc.paid_from) {
					frappe.call({
						method: "erpnext.accounts.doctype.payment_entry.api.twist_gl_entry_credit",
						args: {
							paid_amount_selected_currency: paid_amount_selected_currency,
							n: row.name,
							currency: currency
						},
					}).done((r) => {
						// console.log("r(inner2)", r);
					});
				}
			});
		})
	}

}


// let invoice_currency;

// frappe.ui.form.on('Payment Entry', {
//     onload:function(frm) {
//         console.log(frm.doc.docstatus);
//         if(frm.doc.docstatus != 1) {
//             let ref = frm.doc.references;
//         let invoice_no = ref[0].reference_name;
//         let ref_doctype = ref[0].reference_doctype;       

//         let company_currency = frm.doc.company? frappe.get_doc(":Company", frm.doc.company).default_currency: "";


//         // if(paid_to_account_currency) {
//         //     frm.set_value("currency", paid_to_account_currency);
//         //     // frm.set_value("difference_amount", 1200);
//         //     // frm.toggle_display("set_exchange_gain_loss",
// 		// 	// (frm.doc.paid_amount && frm.doc.received_amount && frm.doc.difference_amount &&
// 		// 	// 	((frm.doc.paid_from_account_currency != company_currency ||
// 		// 	// 		frm.doc.paid_to_account_currency != company_currency) &&
// 		// 	// 		frm.doc.paid_from_account_currency != frm.doc.paid_to_account_currency)));

// 		// frm.refresh_fields();
//         // }
//         if(ref && ref_doctype=='Purchase Invoice') {
//             frappe.call({
//                 method: "erpnext.accounts.doctype.payment_entry.api.get_purchase_invoice",
//                 args: {
//                     invoice_no: invoice_no
//                 }
//             }).done((r) => {
//                 console.log('r: ', r);
//                 let currency = r.message[0].currency;
//                 invoice_currency = currency;
//                 let total = r.message[0].total;
//                 frm.set_value("currency", currency);
//                 frm.set_currency_labels(["total"], currency);
//                 frm.set_value("total", total);
//                 // frm.set_value("received_amount", total);
//                 frm.refresh_fields();
//             })
//         }
//         }

//     },
// 	currency:function(frm){
//         let currency = frm.doc.currency;
//         let company_currency = frm.doc.company? frappe.get_doc(":Company", frm.doc.company).default_currency: "";
//         if(currency) {
//            frm.set_currency_labels(["paid_amount_selected_currency"], frm.doc.currency);
// 	        frm.set_currency_labels(["exchange_rate_currency_to_supplier"], frm.doc.currency);
//             cur_frm.set_df_property("exchange_rate_currency_to_supplier", "description",
// 			    ("1 " + frm.doc.currency + " = [?] " + company_currency)); 
//         }

//     },

// 	paid_amount_selected_currency:function(frm){
//         let paid_amount = frm.doc.paid_amount;
// 	    let paid_amount_selected_currency = frm.doc.paid_amount_selected_currency;
// 	    let paid_from_account_currency = frm.doc.paid_from_account_currency;
// 	    let finalAmount = 1;
// 	    let currency = frm.doc.currency;
// 	    let company_currency = frm.doc.company? frappe.get_doc(":Company", frm.doc.company).default_currency: "";
// 	    let paid_to_account_currency = frm.doc.paid_to_account_currency;
// 	    let exchange_rate_currency_to_supplier = frm.doc.exchange_rate_currency_to_supplier;
// 	    let invoiced_amount = frm.doc.total;

//         console.log("Selected Currency Dropdown: ", !paid_amount);

//         if(!paid_amount) {
//             if(currency == company_currency) {
//                 frm.set_value("paid_amount", paid_amount_selected_currency);
//                 frm.set_value("exchange_rate_currency_to_supplier", 1);

//              }else if(paid_from_account_currency == paid_to_account_currency) {
//                  frappe.call({
//                  method: "erpnext.accounts.doctype.payment_entry.api.get_exchange_rate",
//                  args: {
//                      paid_to_account_currency: paid_to_account_currency,
//                      currency: currency,
//                  }
//              }).done((r) => {
//                  console.log('r.message[0].exchange_rate: ', r.message[0].exchange_rate);
//                  // frm.doc.exchange_rate_currency_to_supplier = r.message[0].exchange_rate;
//                  frm.set_value("exchange_rate_currency_to_supplier", r.message[0].exchange_rate);
//                  frm.refresh_field("exchange_rate_currency_to_supplier");
//                  finalAmount = r.message[0].exchange_rate * paid_amount_selected_currency;
//                  frm.set_value("paid_amount", finalAmount);
//              })

//              }else if(paid_from_account_currency != paid_to_account_currency) {
//                  frappe.call({
//                  method: "erpnext.accounts.doctype.payment_entry.api.get_exchange_rate",
//                  args: {
//                      paid_to_account_currency: paid_from_account_currency,
//                      currency: currency,
//                  }
//              }).done((r) => {
//                  console.log('r.message[0].exchange_rate: ', r.message[0].exchange_rate);
//                  // frm.doc.exchange_rate_currency_to_supplier = r.message[0].exchange_rate;
//                  frm.set_value("exchange_rate_currency_to_supplier", r.message[0].exchange_rate);
//                  frm.refresh_field("exchange_rate_currency_to_supplier");
//                  finalAmount = r.message[0].exchange_rate * paid_amount_selected_currency;
//                  frm.set_value("paid_amount", finalAmount);
//              })


//              }
//         }

//         if(paid_amount && invoice_currency!=currency) {
//             frappe.call({
//                 method: "erpnext.accounts.doctype.payment_entry.api.get_exchange_rate",
//                 args: {
//                     paid_to_account_currency: paid_to_account_currency,
//                     currency: currency,
//                 }
//             }).done((r) => {
//                 let diff_amount;
//                 console.log('r.message[0].exchange_rate: ', r.message[0].exchange_rate);
//                 // frm.doc.exchange_rate_currency_to_supplier = r.message[0].exchange_rate;
//                 // frm.set_value("exchange_rate_currency_to_supplier", r.message[0].exchange_rate);
//                 // frm.refresh_field("exchange_rate_currency_to_supplier");
//                 finalAmount = r.message[0].exchange_rate * paid_amount_selected_currency;
//                 if(frm.doc.paid_amount > finalAmount) {
//                     diff_amount = frm.doc.paid_amount - finalAmount;
//                 //     frm.set_df_property("difference_amount", "read_only", 0);
//                 // frm.refresh_fields();
//                 } else if(frm.doc.paid_amount < finalAmount) {
//                     diff_amount =  finalAmount - frm.doc.paid_amount;
//                 //     frm.set_df_property("difference_amount", "read_only", 0);
//                 // frm.refresh_fields();
//                 }
//                 console.log("unallocated_amount: ", (frm.doc.paid_amount && frm.doc.difference_amount && frm.doc.currency != invoice_currency));
//                 console.log("difference_amount: ", frm.doc.difference_amount);
//                 frm.set_value("paid_amount", finalAmount);
//                 frm.set_value("base_paid_amount", finalAmount);
//                 // frm.refresh_field("difference_amount");
//                 frm.refresh_fields();

//                 if(diff_amount) {
//                 frm.toggle_display("set_exchange_gain_loss",
//                 (frm.doc.paid_amount && frm.doc.difference_amount && (frm.doc.currency != invoice_currency)));


//                 frm.refresh_fields();
//                 }
//             })
//         }


// 	},
// 	paid_amount:function(frm) {
// 	    let paid_amount = frm.doc.paid_amount;
// 	    let paid_amount_selected_currency = frm.doc.paid_amount_selected_currency;
// 	    let paid_from_account_currency = frm.doc.paid_from_account_currency;
// 	    let paid_to_account_currency = frm.doc.paid_to_account_currency;
//         let ref = frm.doc.references;
//         let received_amount = frm.doc.received_amount;
//         console.log("Ref: ", ref);
// 	    if(paid_amount) {
//             if(paid_from_account_currency != paid_to_account_currency){
//                 frappe.call({
//                 method: "erpnext.accounts.doctype.payment_entry.api.get_company_currency_exchange_rate",
//                 args: {
//                     paid_to_account_currency: paid_from_account_currency,
//                     paid_from_account_currency: paid_to_account_currency,
//                 }
//             }).done((r) => {
//                 console.log('r.message[0]: ', r.message[0]);
//                 if(ref == 'undefined' || ref == []){
//                     let supplierCurrency =  frm.doc.paid_amount / r.message[0].exchange_rate;
//                     frm.set_value("received_amount", supplierCurrency);
//                 }
//                 else{
//                     frm.set_value("received_amount", received_amount);
//                 }
//             })
//             }
// 	    }
// 	},
//     target_exchange_rate(frm) {
//         let currency = frm.doc.currency;
//         let paid_to_account_currency = frm.doc.paid_to_account_currency;
//         let target_exchange_rate = frm.doc.target_exchange_rate;
//         let received_amount = frm.doc.received_amount;
//         if(received_amount && target_exchange_rate) {
//             let final_amount = received_amount * target_exchange_rate;
//             frm.set_value("paid_amount", final_amount);
//             if(currency == paid_to_account_currency) {
//                 frm.set_value("paid_amount_selected_currency", received_amount);
//             }
//         }
//     },
//     on_submit(frm) {
//         let company_currency = frm.doc.company? frappe.get_doc(":Company", frm.doc.company).default_currency: "";
//         let paid_amount_selected_currency = frm.doc.paid_amount_selected_currency;
//         let currency = frm.doc.currency;

//         if (currency != company_currency && paid_amount_selected_currency) {
//             update_gl_entry(frm);
//         }
//     }

// })
let invoiceAllocatedAmount = 0;
let isIndependent = false;

frappe.ui.form.on('Payment Entry', {
	onload: function (frm) {
		console.log("frm.doc.__islocal: ", frm.doc.references);
		console.log(frm.doc.docstatus);


		// if (frm.doc.references) {
		// 	$.each(r.message, function(index, row) {
		// 		let ref_name = row.reference_name;
		// 		frappe.call({
		// 			method: "erpnext.accounts.doctype.payment_entry.api.get_invoice_outstanding",
		// 			args: {
		// 				ref_name: ref_name
		// 			},
		// 			async: false
		// 		}).done((r) => {
		// 			console.log('r: ', r);
	
		// 		})

		// 	})

		// }



		let invoice_currency;
		let exchange_rate;
		if (frm.doc.docstatus != 1) {
			let ref = frm.doc.references;
			let invoice_no = ref[0].reference_name;
			let ref_doctype = ref[0].reference_doctype;


			let company_currency = frm.doc.company ? frappe.get_doc(":Company", frm.doc.company).default_currency : "";
			if (ref && ref_doctype == 'Purchase Invoice') {
				frappe.call({
					method: "erpnext.accounts.doctype.payment_entry.api.get_purchase_invoice",
					args: {
						invoice_no: invoice_no
					},
					async: false
				}).done((r) => {
					console.log('r: ', r);
					invoice_currency = r.message[0].currency;
					let total = r.message[0].total;
					exchange_rate = r.message[0].conversion_rate;
					console.log("flag checking 1", r.message[0].conversion_rate);

					if (company_currency != invoice_currency) {
						frm.set_value("currency", invoice_currency);
						frm.set_value("invoice_currency", invoice_currency)
						frm.set_currency_labels(["total"],frm.doc.currency)
						frm.set_value("total", total);
						// frm.set_value("target_exchange_rate", target_exchange_rate);
						frm.set_currency_labels(["total"], invoice_currency);
						console.log("got foreign currency");
					}
					frm.refresh_fields();
				})
			}
			console.log("flag checking 2", invoice_currency);
			frm.events.foreign_currency_fields(frm, invoice_currency, exchange_rate);
		}
		if (frm.doc.docstatus == 1 && frm.doc.total) {
			console.log("Invoiced amount: ", frm.doc.total);
			frm.toggle_display("total", true);
		}
		// if (frm.doc.supplier == 'undefined') {
		// 	isIndependent = true;
		// }

	},
	// target_exchange_rate(frm) {
	// 	frm.events.set_current_exchange_rate(frm, frm.doc.target_exchange_rate, frm.doc.currency, frm.doc.paid_from_account_currency)
	// },
	paid_amount(frm) {
		let ref = frm.doc.references;
		$.each(ref, function (index, row) {
			row.allocated_amount = row.allocated_amount;
			console.log("row.allocated_amount: ", row.allocated_amount);
		})
		frm.refresh_fields();

	},
	foreign_currency_fields: function (frm, invoice_currency, exchange_rate) {
		let company_currency = frm.doc.company ? frappe.get_doc(":Company", frm.doc.company).default_currency : "";

		// invoice currency comes from invoice
		if (invoice_currency != company_currency) {
			// displays invoiced amount if company currency is not equal to payment currency
			frm.toggle_display("total", true);
			frm.set_currency_labels(["total"], frm.doc.invoice_currency);

			//displays invoice exchange rate if there has any invoiced amount in foreign currency
			frm.toggle_display("invoice_exchange_rate", true);

			cur_frm.set_df_property("invoice_exchange_rate", "description",
				("1 " + frm.doc.invoice_currency + " = [?] " + company_currency));

			frm.set_value("invoice_exchange_rate", exchange_rate);

			frm.toggle_display("x", (frm.doc.total));
			frm.set_currency_labels(["x"], company_currency);

		}
	},
	set_current_exchange_rate: function (frm, exchange_rate_field, from_currency, to_currency) {
		frappe.call({
			method: "erpnext.setup.utils.get_exchange_rate",
			args: {
				transaction_date: frm.doc.posting_date,
				from_currency: from_currency,
				to_currency: to_currency
			},
			async: false,
			callback: function (r, rt) {
				console.log("here is frappe's api: ", r);
				frm.set_value(exchange_rate_field, r.message);
			}
		})
	},
	get_current_exchange_rate: function (frm, from_currency, to_currency) {
		let exchange_rate;
		frappe.call({
			method: "erpnext.setup.utils.get_exchange_rate",
			args: {
				transaction_date: frm.doc.posting_date,
				from_currency: from_currency,
				to_currency: to_currency
			},
			async: false,
			callback: function (r, rt) {
				console.log("get exchange rate:", rt);
				exchange_rate = r.message;
			}
		})

		return exchange_rate;
	},
	currency(frm) {
		let company_currency = frm.doc.company ? frappe.get_doc(":Company", frm.doc.company).default_currency : "";
		let payment_currency = frm.doc.currency;
		let invoice_currency = frm.doc.invoice_currency;

		if (invoice_currency != payment_currency) {
			// if the payment currency is not default currency then it must be filled
			frm.toggle_display("payment_amount", true);
			frm.set_currency_labels(["payment_amount"], frm.doc.currency);

			//displays payment exchange rate if invoice currency and payment currency doesn't match
			frm.toggle_display("payment_exchange_rate", true);

			cur_frm.set_df_property("payment_exchange_rate", "description",
				("1 " + frm.doc.currency + " = [?] " + company_currency));

			frm.events.set_current_exchange_rate(frm, "payment_exchange_rate", frm.doc.currency, company_currency)

			let invoice_to_payment = frm.events.get_current_exchange_rate(frm, payment_currency, company_currency);
			let payment_amount = frm.doc.paid_amount / invoice_to_payment;
			frm.set_value("payment_amount", payment_amount);

			let x = frm.doc.payment_exchange_rate * frm.doc.payment_amount;
			frm.set_value("x", x);

			frm.refresh_fields();

			console.log("caught ya!");
		}
	},
	payment_amount(frm) {
		console.log("isIndependent: ", isIndependent);
		let paid_amount = frm.doc.payment_amount;
		if (frm.doc.payment_amount && !frm.doc.paid_amount) {
			let set_paid_amount = frm.doc.payment_amount * frm.doc.payment_exchange_rate;
			console.log("bruh2: ", set_paid_amount);
			frm.set_value("paid_amount", set_paid_amount);
		}
		if (frm.doc.payment_amount && frm.doc.payment_exchange_rate) {
			let set_paid_amount = frm.doc.payment_amount * frm.doc.payment_exchange_rate;
			console.log("bruh3: ", set_paid_amount);
			frm.set_value("x", set_paid_amount);
		}

	},
	invoice_exchange_rate(frm) {
		//in case of same foreign currency payment
		//actual payment amount will be auto calculated on change of invoice exchange rate
		//actual payment amount = invoice amount(foreign currency) * invoice exchange rate
		let invoice_exchange_rate = frm.doc.invoice_exchange_rate;
		let x = frm.doc.total * invoice_exchange_rate;
		frm.set_value("x", x);
		frm.set_value("total_allocated_amount", x);
	},
	payment_exchange_rate(frm) {
		//in case of different foreign currency payment
		//actual payment amount will be auto calculated on change of payment exchange rate
		//actual payment amount = payment amount(foreign currency) * payment exchange rate
		let payment_exchange_rate = frm.doc.payment_exchange_rate;
		let x = frm.doc.payment_amount * payment_exchange_rate;
		frm.set_value("x", x);
		frm.set_value("total_allocated_amount", x);

		// if (frm.doc.payment_amount && frm.doc.references==[]) {
		// 	let set_paid_amount = frm.doc.payment_amount * frm.doc.payment_exchange_rate;
		// 	frm.set_value("paid_amount", set_paid_amount);
		// }
	},
	x(frm) {
		//gain or loss = actual payment amount - paid amount(invoiced BDT amount)
		let x = frm.doc.x;
		let diff = x - frm.doc.paid_amount;
		frm.set_value("difference_amount", diff);
	},
	difference_amount(frm) {
		//when difference amount appears, set exchange gain loss button will be visible
		frm.toggle_display("set_exchange_gain_loss", true);
	},
	set_exchange_gain_loss(frm) {
		//after clicking set exchange gain loss button difference amount will be zero
		frm.set_value("difference_amount", 0);
		frm.toggle_display("set_exchange_gain_loss", false);
	},
	on_submit(frm) {
		//on submit no matter what, difference amount will be zero
		frm.set_value("difference_amount", 0);
		frm.refresh_field("difference_amount");
		frm.toggle_display("set_exchange_gain_loss", false);
		frm.events.update_exchange_rate(frm);
	},
	update_exchange_rate: function (frm) {
		let company_currency = frm.doc.company ? frappe.get_doc(":Company", frm.doc.company).default_currency : "";
		let invoice_currency = frm.doc.invoice_currency;
		let payment_currency = frm.doc.currency;
		let invoice_exchange_rate = frm.doc.invoice_exchange_rate;
		let payment_exchange_rate = frm.doc.payment_exchange_rate;

		//updating invoice to company currency exchange rate
		if (frm.doc.invoice_exchange_rate) {
			frappe.call({
				method: "erpnext.accounts.doctype.payment_entry.api.get_exchange_currency",
				args: {
					from_currency: invoice_currency,
					to_currency: company_currency
				},
				// async: false,
				callback: function (r) {
					console.log("doc_name: ", r.message[0].name);
					let n = r.message[0].name;
					frappe.call({
						method: "erpnext.accounts.doctype.payment_entry.api.update_exchange_rate",
						args: {
							exchange_rate: invoice_exchange_rate,
							n: n
						},
						// async: false,
						callback: function (r) {
							console.log("success: ", r.message);
						}
					})
				}
			})
		}

		//updating payment to company currency exchange rate
		if (payment_exchange_rate) {
			console.log("changing payment exchange rate");
			frappe.call({
				method: "erpnext.accounts.doctype.payment_entry.api.get_exchange_currency",
				args: {
					from_currency: payment_currency,
					to_currency: company_currency
				},
				// async: false,
				callback: function (r) {
					console.log("doc_name: ", r.message[0].name);
					let n = r.message[0].name;
					frappe.call({
						method: "erpnext.accounts.doctype.payment_entry.api.update_exchange_rate",
						args: {
							exchange_rate: payment_exchange_rate,
							n: n
						},
						// async: false,
						callback: function (r) {
							console.log("success: ", r.message);
						}
					})
				}
			})
		}

	},
})

frappe.ui.form.on('Payment Entry Reference', {
	allocated_amount(frm, cdt, cdn) {
		// let child = locals[cdt][cdn];
		// console.log(child);
		let ref = frm.doc.references;
		let child_allocated_amount = 0;
		let isAllocatedNull = false;

		let child = locals[cdt][cdn];
		invoiceAllocatedAmount = child.allocated_amount;
		// console.log("abc: ", abc);

		$.each(ref, function (index, row) {
			if (!row.allocated_amount) {
				console.log("isAllocatedNull! ", !row.allocated_amount);
				isAllocatedNull = true;
			}
		})
		console.log("isAllocatedNull:", isAllocatedNull);

		if (!isAllocatedNull) {
			$.each(ref, function (index, row) {
				console.log(index, " row.allocated_amount: ", row.allocated_amount);
				child_allocated_amount += row.allocated_amount;
			})
			frm.set_value("paid_amount", child_allocated_amount);
			frm.refresh_field("paid_amount")
			frm.refresh_fields("references")
			console.log("INCTL Glorifies");
		}

	}
})
