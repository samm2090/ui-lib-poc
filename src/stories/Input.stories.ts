import { InputControl } from "./atoms/input-text/input.control";
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/angular";
import { moduleMetadata } from '@storybook/angular';
import { MatFormField, MatIcon, MatLabel } from "@angular/material";

export default {
  title: "Atoms/text",
  component: InputControl,
  argTypes: {},
  decorators: [
    moduleMetadata({
      imports: [MatFormField, MatLabel, MatIcon],
    }),
  ],
} as Meta;

const Template: Story<InputControl> = (args: InputControl) => ({
  component: InputControl,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  label: "Haz click",
  placeholder: "Algo",
};
