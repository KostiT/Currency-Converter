import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import fireAjax from "./service/fireAjax";
import "./App.scss";

function App() {
  const [baseCurrency, baseCurrencyHandler] = useState("");
  const [toCurrency, toCurrencyHandler] = useState("");
  const [amount, amount_handler] = useState(0);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (
      baseCurrency != "" &&
      baseCurrency.length > 2 &&
      toCurrency != "" &&
      toCurrency.length > 2 &&
      amount > 0
    ) {
      fireAjax(
        "GET",
        `https://api.exchangeratesapi.io/latest?base=${baseCurrency}`,
        {},
        {}
      )
        .then(response => {
          const rate = response.data.rates[toCurrency];
          if (rate) {
            setCalculatedAmount(amount * rate);
            setErrorText("");
          } else {
            setErrorText(`Can not convert to ${toCurrency}`);
          }
        })
        .catch(e => {
          if (e.response) {
            setErrorText(e.response.data.error);
          }
        });
    }
  });

  return (
    <>
      <header>
        <h1 className="text-center">Currency Converter</h1>
      </header>
      <div className="App">
        <Form>
          <Row form>
            <Col md={4}>
              <FormGroup>
                <Label for="exampleEmail">From</Label>
                <Input
                  type="text"
                  name="baseCurrency"
                  placeholder="Convert From"
                  maxLength={3}
                  value={baseCurrency}
                  onChange={e => {
                    baseCurrencyHandler(e.target.value.toUpperCase());
                  }}
                  pattern={"[a-zA-Z]*"}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="examplePassword">To</Label>
                <Input
                  type="text"
                  name="toCurrency"
                  placeholder="Convert To"
                  value={toCurrency}
                  maxLength={3}
                  onChange={e => {
                    toCurrencyHandler(e.target.value.toUpperCase());
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="examplePassword">Amount</Label>
                <Input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={amount}
                  onChange={e => {
                    amount_handler(e.target.value);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <Button
            color="primary"
            size="md"
            onClick={() => {
              let toCurrencySwap = toCurrency;
              let fromCurrencySwap = baseCurrency;
              toCurrencyHandler(fromCurrencySwap);
              baseCurrencyHandler(toCurrencySwap);
            }}
          >
            {" "}
            SWAP{" "}
          </Button>
        </Form>
        <div className="result">
          <Row>
            <Col>
              {calculatedAmount > 0 && errorText === "" ? (
                <span className="result-text">
                  {amount} {baseCurrency} = {calculatedAmount.toFixed(2)}{" "}
                  {toCurrency}
                </span>
              ) : (
                <span className="error-text">{errorText}</span>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default App;
