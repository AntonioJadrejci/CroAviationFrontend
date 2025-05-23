describe('HomeView.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message';
    const wrapper = shallowMount(HomeView, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});