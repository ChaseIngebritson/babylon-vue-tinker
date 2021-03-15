import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Viewer from '@/components/Viewer.vue'

describe('Viewer.vue', () => {
  it('renders canvas when passed', () => {
    const wrapper = shallowMount(Viewer)
    expect(wrapper.html()).to.include('canvas')
  })
})
