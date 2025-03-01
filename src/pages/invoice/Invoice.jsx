
import React, { FC, Fragment, useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Select from "react-select";

import togglelogo from "../../assets/images/brand-logos/desktop-dark.png";

const Invoice = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [startDate1, setStartDate1] = useState(new Date());
	const handleDateChange = (date) => {
		// Ensure date is defined before setting it
		if (date) {
			setStartDate(date);
		}
	};
	const handleDateChange1 = (date) => {
		// Ensure date is defined before setting it
		if (date) {
			setStartDate1(date);
		}
	};
	//
	function dec(el) {
		const unit = el.currentTarget.parentElement.querySelector("input").value;

		if (Number(unit) === 0) {
			return false;
		} else {
			el.currentTarget.parentElement.querySelector("input").value--;
		}
	}
	function inc(el) {
		el.currentTarget.parentElement.querySelector("input").value++;
	}
	const Currencyoptions = [
		{ value: "Select Currency", label: "Select Currency" },
		{ value: "USD - (United States Dollar)", label: "USD - (United States Dollar)" },
		{ value: "BHD - (Bahraini Dinar)", label: "BHD - (Bahraini Dinar)" },
		{ value: "KWD - (Kuwaiti Dinar)", label: "KWD - (Kuwaiti Dinar)" },
		{ value: "CHF - (Swiss Franc)", label: "CHF - (Swiss Franc)" },
	];
	return (
		<Fragment>
			<Row>
				<Col xl={12}>
					<Card className="custom-card">
						<Card.Header className="d-md-flex d-block">
							<div className="h5 mb-0 d-sm-flex d-block align-items-center">
								<div>
									<img src={togglelogo} alt="" />
								</div>
								<div className="ms-sm-2 ms-0 mt-sm-0 mt-2">
									<Form.Control type="text" className="form-control form-control-sm" placeholder="Invoice Title" defaultValue="INV TITLE" />
								</div>
								<div className="mx-2">:</div>
								<div className="mt-sm-0 mt-2">
									<Form.Control type="text" className="form-control form-control-sm" placeholder="Invoice ID" defaultValue="INV ID" />
								</div>
							</div>
							<div className="ms-auto mt-md-0 mt-2">
								<Button variant='' type="button" className="btn  btn-primary me-2">Save As PDF<i className="ri-file-pdf-line ms-1 align-middle d-inline-block"></i></Button>
								<Button variant='' type="button" className="btn  btn-icon btn-secondary me-2"><i className="bx bx-plus"></i></Button>
								<Button variant='' type="button" className="btn  btn-icon btn-info me-2"><i className="bx bx-download"></i></Button>
							</div>
						</Card.Header>
						<Card.Body>
							<div className="row gy-3">
								<Col xl={12}>
									<Row>
										<div className="col-xl-6 col-lg-4 col-md-6 col-sm-6">
											<p className="dw-semibold mb-2">
												Billing From :
											</p>
											<div className="row gy-2">
												<Col xl={12}>
													<Form.Control type="text" id="Company-Name" placeholder="Company Name" defaultValue="SPRUKO TECHNOLOGIES" />
												</Col>
												<Col xl={12}>
													<Form.Control as="textarea" id="company-address" placeholder="Enter Address" rows={3}></Form.Control>
												</Col>
												<Col xl={12}>
													<Form.Control type="text" id="company-mail" placeholder="Company Email" defaultValue="" />
												</Col>
												<Col xl={12}>
													<Form.Control type="text" id="company-phone" placeholder="Phone Number" defaultValue="" />
												</Col>
												<Col xl={12}>
													<Form.Control as="textarea" id="invoice-subject" placeholder="Subject" rows={4}></Form.Control>
												</Col>
											</div>
										</div>
										<div className="col-xl-6 col-lg-4 col-md-6 col-sm-6 ms-auto mt-sm-0 mt-3">
											<p className="dw-semibold mb-2">
												Billing To :
											</p>
											<div className="row gy-2">
												<Col xl={12}>
													<Form.Control type="text" id="customer-Name" placeholder="Customer Name" defaultValue="Json Taylor" />
												</Col>
												<Col xl={12}>
													<Form.Control as="textarea" id="customer-address" placeholder="Enter Address" rows={3}></Form.Control>
												</Col>
												<Col xl={12}>
													<Form.Control type="text" id="customer-mail" placeholder="Customer Email" defaultValue="" />
												</Col>
												<Col xl={12}>
													<Form.Control type="text" id="customer-phone" placeholder="Phone Number" defaultValue="" />
												</Col>
												<Col xl={12}>
													<Form.Control type="text" id="zip-code" placeholder="Zip Code" defaultValue="" />
												</Col>
												<div className="col-xl-12 choices-control">
													<p className="dw-semibold mb-2 mt-2">
														Currency :
													</p>
													{/* <select  data-trigger name="invoice-currency" id="invoice-currency">
                                                            <option value="">Select Currency</option>
                                                            <option value="Armani">USD - (United States Dollar)</option>
                                                            <option value="Lacoste">BHD - (Bahraini Dinar)</option>
                                                            <option value="Puma">KWD - (Kuwaiti Dinar)</option>
                                                            <option value="Spykar">CHF - (Swiss Franc)</option>
                                                        </select> */}
													<Select options={Currencyoptions} classNamePrefix='Select2' menuPlacement='auto' className="multi-select"
														placeholder="Select Currency" />
												</div>
											</div>
										</div>
									</Row>
								</Col>
								<Col xl={3}>
									<Form.Label htmlFor="invoice-number">Invoice ID</Form.Label>
									<Form.Control type="text" id="invoice-number" placeholder="Inv No"
									// Invoice ID="#SPK120219890"
									/>
								</Col>
								<Col xl={3}>
									<Form.Label htmlFor="invoice-date-issued">Date Issued</Form.Label>
									{/* <Form.Control type="text"  id="invoice-date-issued" placeholder="Choose date"/> */}
									<DatePicker placeholderText='Choose date' className=" form-control-light"
										selected={startDate}
										onChange={handleDateChange} />
								</Col>
								<Col xl={3}>
									<Form.Label htmlFor="invoice-date-due">Due Date</Form.Label>
									{/* <Form.Control type="text"  id="invoice-date-due" placeholder="Choose date"/> */}
									<DatePicker placeholderText='Choose date' className=" form-control-light"
										selected={startDate1}
										onChange={handleDateChange1} />
								</Col>
								<Col xl={3}>
									<Form.Label htmlFor="invoice-due-amount">Due Amount</Form.Label>
									<Form.Control type="text" id="invoice-due-amount" placeholder="Enter Amount" defaultValue="$12,983.78" />
								</Col>
								<Col xl={12}>
									<div className="table-responsive">
										<Table className="table nowrap text-nowrap border mt-3">
											<thead>
												<tr>
													<th scope="col">PRODUCT NAME</th>
													<th scope="col">DESCRIPTION</th>
													<th scope="col">QUANTITY</th>
													<th scope="col">PRICE PER UNIT</th>
													<th scope="col">TOTAL</th>
													<th scope="col">ACTION</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>
														<Form.Control type="text" placeholder="Enter Product Name" />
													</td>
													<td>
														<Form.Control as="textarea" rows={1} placeholder="Enter Description"></Form.Control>
													</td><td className="invoice-quantity-container">
														<div className="input-group border rounded flex-nowrap">
															<Button variant='' className="btn btn-icon btn-primary input-group-text flex-fill product-quantity-minus" onClick={dec}>
																<i className="ri-subtract-line"></i>
															</Button>
															<Form.Control type="text" className="form-control form-control-sm border-0 text-center w-100" aria-label="quantity" defaultValue="1" />
															<Button variant='' className="btn btn-icon btn-primary input-group-text flex-fill product-quantity-plus" onClick={inc}>
																<i className="ri-add-line"></i>
															</Button>
														</div>
													</td>
													<td><Form.Control className="form-control invoice-input" placeholder="" type="text" defaultValue="$60.00" /></td>
													<td><Form.Control className="form-control invoice-input" placeholder="" type="text" defaultValue="$120.00" /></td>
													<td>
														<Button variant='' className="btn btn-sm btn-icon btn-danger-light"><i className="ri-delete-bin-5-line"></i></Button>
													</td>
												</tr>
												<tr>
													<td>
														<Form.Control type="text" placeholder="Enter Product Name" />
													</td>
													<td>
														<Form.Control as="textarea" rows={1} placeholder="Enter Description"></Form.Control>
													</td><td className="invoice-quantity-container">
														<div className="input-group border rounded flex-nowrap">
															<Button variant='' className="btn btn-icon btn-primary input-group-text flex-fill product-quantity-minus" onClick={dec}>
																<i className="ri-subtract-line"></i>
															</Button>
															<Form.Control type="text" className="form-control form-control-sm border-0 text-center w-100" aria-label="quantity" defaultValue="1" />
															<Button variant='' className="btn btn-icon btn-primary input-group-text flex-fill product-quantity-plus" onClick={inc}>
																<i className="ri-add-line"></i>
															</Button>
														</div>
													</td>
													<td><Form.Control className="form-control invoice-input" placeholder="" type="text" defaultValue="$60.00" /></td>
													<td><Form.Control className="form-control invoice-input" placeholder="" type="text" defaultValue="$120.00" /></td>
													<td>
														<Button variant='' className="btn btn-sm btn-icon btn-danger-light"><i className="ri-delete-bin-5-line"></i></Button>
													</td>
												</tr>
												<tr>
													<td>
														<Form.Control type="text" placeholder="Enter Product Name" />
													</td>
													<td>
														<Form.Control as="textarea" rows={1} placeholder="Enter Description"></Form.Control>
													</td>
													<td className="invoice-quantity-container">
														<div className="input-group border rounded flex-nowrap">
															<Button variant='' className="btn btn-icon btn-primary input-group-text flex-fill product-quantity-minus" onClick={dec}>
																<i className="ri-subtract-line"></i>
															</Button>
															<Form.Control type="text" className="form-control form-control-sm border-0 text-center w-100" aria-label="quantity" defaultValue="1" />
															<Button variant='' className="btn btn-icon btn-primary input-group-text flex-fill product-quantity-plus" onClick={inc}>
																<i className="ri-add-line"></i>
															</Button>
														</div>
													</td>
													<td><Form.Control className="form-control invoice-input" placeholder="Enter Amount" type="text" /></td>
													<td><Form.Control className="form-control invoice-input" placeholder="Enter Amount" type="text" /></td>
													<td>
														<Button variant='' className="btn btn-sm btn-icon btn-danger-light"><i className="ri-delete-bin-5-line"></i></Button>
													</td>
												</tr>
												<tr>
													<td colSpan={6} className="border-bottom-0"><a className="btn btn-light" href="#;"><i className="bi bi-plus-lg"></i> Add Product</a></td>
												</tr>
												<tr>
													<td colSpan={4}></td>
													<td colSpan={2}>
														<Table className="table table-sm text-nowrap mb-0 table-borderless">
															<tbody>
																<tr>
																	<th scope="row">
																		<div className="fw-semibold">Sub Total :</div>
																	</th>
																	<td>
																		<Form.Control type="text" className="form-control invoice-amount-input" placeholder="Enter Amount" defaultValue="$1209.89" />
																	</td>
																</tr>
																<tr>
																	<th scope="row">
																		<div className="fw-semibold">Avail Discount :</div>
																	</th>
																	<td>
																		<Form.Control type="text" className="form-control invoice-amount-input" placeholder="Enter Amount" defaultValue="$29.98" />
																	</td>
																</tr>
																<tr>
																	<th scope="row">
																		<div className="fw-semibold">Coupon Discount <span className="text-success">(10%)</span> :</div>
																	</th>
																	<td>
																		<Form.Control type="text" className="form-control invoice-amount-input" placeholder="Enter Amount" defaultValue="$129.00" />
																	</td>
																</tr>
																<tr>
																	<th scope="row">
																		<div className="fw-semibold">Vat <span className="text-danger">(20%)</span> :</div>
																	</th>
																	<td>
																		<Form.Control type="text" className="form-control invoice-amount-input" placeholder="Enter Amount" defaultValue="$258.00" />
																	</td>
																</tr>
																<tr>
																	<th scope="row">
																		<div className="fw-semibold">Due Till Date :</div>
																	</th>
																	<td>
																		<Form.Control type="text" className="form-control invoice-amount-input" placeholder="Enter Amount" defaultValue="$0.00" />
																	</td>
																</tr>
																<tr>
																	<th scope="row">
																		<div className="fs-14 fw-semibold">Total :</div>
																	</th>
																	<td>
																		<Form.Control type="text" className="form-control invoice-amount-input" placeholder="Enter Amount" defaultValue="$1,071.89" />
																	</td>
																</tr>
															</tbody>
														</Table>
													</td>
												</tr>
											</tbody>
										</Table>
									</div>
								</Col>
								<Col xl={12}>
									<div>
										<label htmlFor="invoice-note" className="form-label">Note:</label>
										<Form.Control as="textarea" id="invoice-note" rows={3} defaultValue=" Once the invoice has been verified by the accounts payable team and recorded, 
                                                the only task left is to send it for approval before releasing the payment">
										</Form.Control>
									</div>
								</Col>
							</div>
						</Card.Body>
						<div className="card-footer text-end">
							<Button variant='' className="btn btn-light me-1 d-inline-flex "><i className="ri-eye-line me-1 align-middle"></i>Preview</Button>
							<Button variant='' className="btn btn-primary d-inline-flex ">Send Invoice <i className="ri-send-plane-2-line ms-1 align-middle"></i></Button>
						</div>
					</Card>
				</Col>
			</Row>

		</Fragment>
	);
};
export default Invoice;
