import { defineType, defineField } from "sanity";

export const footer = defineType({
  name: "footer",
  title: "Footer Section",
  type: "document",
  fields: [
    defineField({
      name: "sectionName",
      title: "Section Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerLink",
          title: "Footer Link",
          fields: [
            { name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() },
            { name: "url", title: "URL", type: "string", validation: (Rule) => Rule.required() },
          ],
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      description: "Only populate if this section displays social media buttons.",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          title: "Social Link",
          fields: [
            {
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "GitHub", value: "github" },
                  { title: "Twitter / X", value: "twitter" },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            { name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() },
          ],
        },
      ],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      description: "Only populate for the copyright footer bar section.",
    }),
  ],
});
