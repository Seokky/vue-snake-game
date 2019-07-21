import { shallowMount } from '@vue/test-utils';
import GameArea from '@/components/Game/GameArea.vue';

describe('GameArea.vue', () => {
  it('prepareForGame function is called one time', () => {
    const wrapper = shallowMount(GameArea, {});
  });
});
