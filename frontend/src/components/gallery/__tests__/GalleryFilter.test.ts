import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GalleryFilter from '../GalleryFilter.vue'

describe('GalleryFilter', () => {
  it('renders all filter controls', () => {
    const wrapper = mount(GalleryFilter)

    expect(wrapper.find('.search-input').exists()).toBe(true)
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.find('.view-toggle').exists()).toBe(true)
    expect(wrapper.find('.filter-toggles').exists()).toBe(true)
  })

  it('emits filter-change event when search input changes', async () => {
    const wrapper = mount(GalleryFilter)
    const searchInput = wrapper.find('.search-input')

    await searchInput.setValue('test search')
    await searchInput.trigger('input')

    expect(wrapper.emitted('filter-change')).toBeTruthy()
    const emittedEvent = wrapper.emitted('filter-change')?.[0]?.[0] as any
    expect(emittedEvent.search).toBe('test search')
  })

  it('emits filter-change event when category changes', async () => {
    const wrapper = mount(GalleryFilter)
    const categorySelect = wrapper.find('select')

    await categorySelect.setValue('miniatures')
    await categorySelect.trigger('change')

    expect(wrapper.emitted('filter-change')).toBeTruthy()
    const emittedEvent = wrapper.emitted('filter-change')?.[0]?.[0] as any
    expect(emittedEvent.category).toBe('miniatures')
  })

  it('emits view-change event when view mode changes', async () => {
    const wrapper = mount(GalleryFilter)
    const gridButton = wrapper.find('.view-button:first-child')

    await gridButton.trigger('click')

    expect(wrapper.emitted('view-change')).toBeTruthy()
    expect(wrapper.emitted('view-change')?.[0]?.[0]).toBe('grid')
  })

  it('shows active view mode correctly', async () => {
    const wrapper = mount(GalleryFilter)
    
    // Initially masonry should be active
    const masonryButton = wrapper.find('.view-button:last-child')
    expect(masonryButton.classes()).toContain('active')

    // Click grid button
    const gridButton = wrapper.find('.view-button:first-child')
    await gridButton.trigger('click')

    expect(gridButton.classes()).toContain('active')
    expect(masonryButton.classes()).not.toContain('active')
  })

  it('handles featured toggle correctly', async () => {
    const wrapper = mount(GalleryFilter)
    const featuredCheckbox = wrapper.find('input[type="checkbox"]:first-child')

    await featuredCheckbox.setChecked(true)
    await featuredCheckbox.trigger('change')

    expect(wrapper.emitted('filter-change')).toBeTruthy()
    const emittedEvent = wrapper.emitted('filter-change')?.[0]?.[0] as any
    expect(emittedEvent.showOnlyFeatured).toBe(true)
  })

  it('handles 3D models toggle correctly', async () => {
    const wrapper = mount(GalleryFilter)
    const checkbox3D = wrapper.find('input[type="checkbox"]:last-child')

    await checkbox3D.setChecked(true)
    await checkbox3D.trigger('change')

    expect(wrapper.emitted('filter-change')).toBeTruthy()
    const emittedEvent = wrapper.emitted('filter-change')?.[0]?.[0] as any
    expect(emittedEvent.showOnlyWith3D).toBe(true)
  })

  it('shows clear search button when search has value', async () => {
    const wrapper = mount(GalleryFilter)
    const searchInput = wrapper.find('.search-input')

    expect(wrapper.find('.clear-search').exists()).toBe(false)

    await searchInput.setValue('test')
    expect(wrapper.find('.clear-search').exists()).toBe(true)
  })

  it('clears search when clear button is clicked', async () => {
    const wrapper = mount(GalleryFilter)
    const searchInput = wrapper.find('.search-input')

    await searchInput.setValue('test')
    const clearButton = wrapper.find('.clear-search')
    await clearButton.trigger('click')

    expect(searchInput.element.value).toBe('')
    expect(wrapper.emitted('filter-change')).toBeTruthy()
  })

  it('shows clear filters button when filters are active', async () => {
    const wrapper = mount(GalleryFilter)

    expect(wrapper.find('.clear-filters-button').exists()).toBe(false)

    // Add a filter
    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('test')

    expect(wrapper.find('.clear-filters-button').exists()).toBe(true)
  })

  it('clears all filters when clear all button is clicked', async () => {
    const wrapper = mount(GalleryFilter)
    
    // Set some filters
    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('test')
    
    const categorySelect = wrapper.find('select')
    await categorySelect.setValue('miniatures')
    
    const featuredCheckbox = wrapper.find('input[type="checkbox"]:first-child')
    await featuredCheckbox.setChecked(true)

    // Clear all filters
    const clearButton = wrapper.find('.clear-filters-button')
    await clearButton.trigger('click')

    expect(searchInput.element.value).toBe('')
    expect(categorySelect.element.value).toBe('')
    expect(featuredCheckbox.element.checked).toBe(false)
  })

  it('displays active filters correctly', async () => {
    const wrapper = mount(GalleryFilter)

    expect(wrapper.find('.active-filters').exists()).toBe(false)

    // Add filters
    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('dragon')
    
    const categorySelect = wrapper.find('select')
    await categorySelect.setValue('miniatures')

    expect(wrapper.find('.active-filters').exists()).toBe(true)
    expect(wrapper.find('.filter-tag').exists()).toBe(true)
  })

  it('removes individual filters from active filters', async () => {
    const wrapper = mount(GalleryFilter)

    // Add search filter
    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('test')

    // Remove the filter
    const removeButton = wrapper.find('.remove-filter')
    await removeButton.trigger('click')

    expect(searchInput.element.value).toBe('')
    expect(wrapper.emitted('filter-change')).toBeTruthy()
  })

  it('has correct category options', () => {
    const wrapper = mount(GalleryFilter)
    const categorySelect = wrapper.find('select')
    const options = categorySelect.findAll('option')

    expect(options.length).toBeGreaterThan(1) // At least "All categories" + actual categories
    expect(options[0].text()).toBe('Все категории')
    expect(options[1].text()).toBe('Миниатюры')
  })

  it('has correct sort options', () => {
    const wrapper = mount(GalleryFilter)
    const sortSelects = wrapper.findAll('select')
    const sortSelect = sortSelects[1] // Second select is for sorting
    const options = sortSelect.findAll('option')

    expect(options.length).toBe(5)
    expect(options[0].text()).toBe('Сначала новые')
    expect(options[1].text()).toBe('Сначала старые')
    expect(options[2].text()).toBe('По названию (А-Я)')
    expect(options[3].text()).toBe('По названию (Я-А)')
    expect(options[4].text()).toBe('Рекомендуемые')
  })

  it('emits correct filter object structure', async () => {
    const wrapper = mount(GalleryFilter)
    const searchInput = wrapper.find('.search-input')

    await searchInput.setValue('test')
    await searchInput.trigger('input')

    const emittedEvent = wrapper.emitted('filter-change')?.[0]?.[0] as any
    expect(emittedEvent).toHaveProperty('search')
    expect(emittedEvent).toHaveProperty('category')
    expect(emittedEvent).toHaveProperty('sortBy')
    expect(emittedEvent).toHaveProperty('viewMode')
    expect(emittedEvent).toHaveProperty('showOnlyFeatured')
    expect(emittedEvent).toHaveProperty('showOnlyWith3D')
  })

  it('maintains filter state correctly', async () => {
    const wrapper = mount(GalleryFilter)

    // Set multiple filters
    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('dragon')

    const categorySelect = wrapper.find('select')
    await categorySelect.setValue('miniatures')

    const featuredCheckbox = wrapper.find('input[type="checkbox"]:first-child')
    await featuredCheckbox.setChecked(true)

    // Check that all values are maintained
    expect(searchInput.element.value).toBe('dragon')
    expect(categorySelect.element.value).toBe('miniatures')
    expect(featuredCheckbox.element.checked).toBe(true)
  })
})