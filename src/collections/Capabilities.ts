import { CollectionConfig } from 'payload';

export const Capabilities: CollectionConfig = {
  slug: 'capabilities',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              admin: {
                position: 'sidebar'
              }
            },
            // --- 1. FIXED HERO (Always present) ---
            {
              type: 'group',
              name: 'hero',
              label: 'Hero Section',
              fields: [
                { name: 'headline', type: 'text', required: true },
                { name: 'subheadline', type: 'textarea' },
                { name: 'heroImage', type: 'upload', relationTo: 'media' },
                {
                  type: 'row',
                  fields: [
                    { name: 'primaryCtaText', type: 'text', admin: { width: '50%' } },
                    { name: 'primaryCtaLink', type: 'text', admin: { width: '50%' } },
                  ]
                }
              ]
            },
            // --- 2. FLEXIBLE PAGE BUILDER (The SEO Meat) ---
            {
              name: 'layout',
              label: 'Page Sections',
              type: 'blocks',
              blocks: [
                // BLOCK: Problem/Pain Points
                {
                  slug: 'problemSection',
                  fields: [
                    { name: 'headline', type: 'text' },
                    {
                      name: 'painPoints',
                      type: 'array',
                      fields: [
                        { name: 'title', type: 'text' },
                        { name: 'description', type: 'textarea' },
                        { name: 'icon', type: 'text' } // Emoji or Icon Name
                      ]
                    }
                  ]
                },
                // BLOCK: How It Works (Step by Step)
                {
                  slug: 'howItWorks',
                  fields: [
                    { name: 'headline', type: 'text' },
                    {
                      name: 'steps',
                      type: 'array',
                      fields: [
                        { name: 'stepNumber', type: 'text' }, // e.g., "01"
                        { name: 'title', type: 'text' },
                        { name: 'description', type: 'textarea' },
                        { name: 'stepImage', type: 'upload', relationTo: 'media' }
                      ]
                    }
                  ]
                },
                // BLOCK: Detailed Features (The Grid)
                {
                  slug: 'featureGrid',
                  fields: [
                    { name: 'headline', type: 'text' },
                    {
                      name: 'features',
                      type: 'array',
                      fields: [
                        { name: 'title', type: 'text' },
                        { name: 'description', type: 'textarea' },
                        { name: 'screenshot', type: 'upload', relationTo: 'media' },
                        {
                          name: 'benefits',
                          type: 'array',
                          fields: [{ name: 'item', type: 'text' }]
                        }
                      ]
                    }
                  ]
                },
                // BLOCK: Use Cases (Deep Dive Stories)
                {
                  slug: 'useCases',
                  fields: [
                    { name: 'headline', type: 'text' },
                    {
                      name: 'cases',
                      type: 'array',
                      fields: [
                        { name: 'persona', type: 'text' }, // e.g., "Growth Teams"
                        { name: 'scenario', type: 'textarea' },
                        { name: 'outcome', type: 'textarea' },
                        { name: 'image', type: 'upload', relationTo: 'media' }
                      ]
                    }
                  ]
                },
                // BLOCK: Comparison Table (SEO Gold)
                {
                  slug: 'comparisonTable',
                  fields: [
                    { name: 'headline', type: 'text' },
                    { name: 'subheadline', type: 'textarea' },
                    {
                      name: 'rows',
                      type: 'array',
                      fields: [
                        { name: 'feature', type: 'text' },
                        { name: 'valueA', type: 'text', label: 'Value A' },
                        { name: 'valueB', type: 'text', label: 'Value B' },
                      ]
                    }
                  ]
                },
                // BLOCK: Testimonials / Social Proof
                {
                  slug: 'testimonials',
                  fields: [
                    { name: 'headline', type: 'text' },
                    {
                      name: 'quotes',
                      type: 'array',
                      fields: [
                        { name: 'quote', type: 'textarea' },
                        { name: 'author', type: 'text' },
                        { name: 'authorTitle', type: 'text' },
                        { name: 'avatar', type: 'upload', relationTo: 'media' },
                      ]
                    }
                  ]
                },
                // BLOCK: Call to Action
                {
                  slug: 'ctaSection',
                  fields: [
                    { name: 'headline', type: 'text' },
                    { name: 'subheadline', type: 'textarea' },
                    {
                      type: 'row',
                      fields: [
                        { name: 'primaryCtaText', type: 'text', admin: { width: '50%' } },
                        { name: 'primaryCtaLink', type: 'text', admin: { width: '50%' } },
                      ]
                    }
                  ]
                },
                // BLOCK: Rich Text / General Content
                {
                  slug: 'richTextSection',
                  fields: [
                    {
                      name: 'content',
                      type: 'richText'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', type: 'text' },
            { name: 'seoDescription', type: 'textarea' },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
          ]
        }
      ]
    }
  ]
};