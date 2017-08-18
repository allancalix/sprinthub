// @flow
import React from 'react';
import { Modal, Image, Label, Icon, Grid } from 'semantic-ui-react';

type Props = {
  attachments: Array<mixed>,
};

const ImagePreview = ({ attachments }: Props) => (
  <Grid centered padded>
    {attachments.map(item => {
      return (
        <Grid.Column key={item.id} verticalAlign="middle" width={4}>
          {item.previews.length > 0
            ? <Modal basic trigger={<Image fluid src={item.previews[3].url} />}>
              <Modal.Content>
                <Image src={item.url} />
              </Modal.Content>
            </Modal>
            : <Label
              key={item.id}
              as="a"
              size="small"
              onClick={() => open(item.url)}
            >
              <Icon name="external share" />
              {item.name}
            </Label>
          }
        </Grid.Column>
      );
    })}
  </Grid>
);

export default ImagePreview;
