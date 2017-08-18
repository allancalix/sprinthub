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
  errors: Object,
  pendingLogin: boolean
};

const JiraLogin = ({ form, onChange, onSubmit, errors, pendingLogin }: Props) => (
  <Grid.Column style={{ maxWidth: 450 }}>
    <Segment stacked>
      <Form onSubmit={onSubmit} className={'large'} style={{ maxWidth: 450 }} loading={pendingLogin}>
        <Form.Input
          label="Domain"
          type="text"
          name="domain"
          placeholder="domain.jira.com"
          onChange={onChange}
          value={form.domain}
          as={Form.Field}
          error={errors.domain || false}
        />
        {false && <Message error={false} header="Invalid Domain" content="There was an error" />}
        <Form.Input
          type="text"
          label={'Project Key'}
          name={'project'}
          placeholder={'EXAM'}
          value={form.project}
          maxLength={4}
          error={errors.project || false}
          onChange={onChange}
        />
        <Form.Input
          type="text"
          name="username"
          label="Username"
          placeholder="Username"
          value={form.username}
          error={errors.username || false}
          onChange={onChange}
        />
        {false || <Message error content={errors.username} /> }
        <Form.Input
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          value={form.password}
          error={errors.password || false}
          onChange={onChange}
        />
        <Button primary fluid size="large">Connect</Button>
      </Form>
    </Segment>
  </Grid.Column>
);

export default JiraLogin;
