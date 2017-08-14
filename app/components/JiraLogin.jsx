// @flow
import React from 'react';
import { Grid, Form, Button, Segment, Message } from 'semantic-ui-react';

type Props = {
  form: {
    username: string,
    password: string,
    project: string,
    domain: string
  },
  onChange: () => void,
  onSubmit: () => void,
  errors: Object
};

const JiraLogin = ({ form, onChange, onSubmit, errors, pendingLogin }: Props) => (
  <Grid.Column style={{ maxWidth: 450 }}>
    <Segment stacked>
      <Form error onSubmit={onSubmit} className={'large'} style={{ maxWidth: 450 }} loading={pendingLogin}>
        <Form.Input
          label="Domain"
          type="text"
          name="domain"
          placeholder="domain.jira.com"
          onChange={onChange}
          value={form.domain}
          as={Form.Field}
          error={false}
        />
        {false && <Message error={false} header="Invalid Domain" content="There was an error" />}
        <Form.Input
          type="text"
          label={'Project Key'}
          name={'project'}
          placeholder={'EXAM'}
          value={form.project}
          onChange={onChange}
        />
        <Form.Input
          type="text"
          name="username"
          label="Username"
          placeholder="Username"
          value={form.username}
          onChange={onChange}
        />
        <Form.Input
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />
        <Button primary fluid size="large">Connect</Button>
      </Form>
    </Segment>
  </Grid.Column>
);

export default JiraLogin;
