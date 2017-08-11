import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormLayout, TextField, Card } from '@shopify/polaris';
import '../../styles/support.scss';

class Support extends Component {
  constructor (props) {
    super(props);
    this.state = {
      first: '',
      last: '',
      email: '',
      question: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit (e) {
    e.preventDefault();
    const { first, last, email } = this.state;
    console.log('submitting', first, last, email);
  }

  render () {
    return (
      <section className="support">
        <Card sectioned title="Support details">
          <div className="support__intro">
            <h2>Need some help?</h2>
            <p>
              Start with our <Link to="/settings/faq">FAQ</Link>. Most, if not
              all, commonly asked question should be addressed there.
            </p>

            <p>Contact us. We usually respond within 24 &ndash; 48 hours.</p>
          </div>
          <FormLayout>
            <TextField
              label="First name"
              name="first"
              value={this.state.first}
              placeholder="First name"
              onChange={this.handleChange}
            />

            <TextField
              label="Last name"
              name="last"
              value={this.state.last}
              placeholder="Last name"
              onChange={this.handleChange}
            />

            <TextField
              label="email"
              name="email"
              value={this.state.email}
              placeholder="Email"
              onChange={this.handleChange}
            />
            <textarea
              value={this.state.question}
              name="question"
              placeholder="Enter your question here."
              onChange={this.handleChange}
            />
            <button>Submit</button>
          </FormLayout>
        </Card>
      </section>
    );
  }
}

export default Support;
