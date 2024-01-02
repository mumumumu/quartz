import remarkGfm from "remark-gfm"
import smartypants from "remark-smartypants"
import { Root as HtmlRoot } from "hast"
import { QuartzTransformerPlugin } from "../types"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { PluggableList } from "unified"
import { visit } from "unist-util-visit"

export interface Options {
  enableCheckboxes: boolean
  enableSmartyPants: boolean
  linkHeadings: boolean
}

const defaultOptions: Options = {
  enableCheckboxes: true,
  enableSmartyPants: true,
  linkHeadings: true,
}

export const GitHubFlavoredMarkdown: QuartzTransformerPlugin<Partial<Options> | undefined> = (
  userOpts,
) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "GitHubFlavoredMarkdown",
    markdownPlugins() {
      return opts.enableSmartyPants ? [remarkGfm, smartypants] : [remarkGfm]
    },
    htmlPlugins() {
      const plugins: PluggableList = []

      if (opts.linkHeadings) {
        plugins.push(rehypeSlug, [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            properties: {
              ariaHidden: true,
              tabIndex: -1,
              "data-no-popover": true,
            },
            content: {
              type: "text",
              value: " §",
            },
          },
        ])
      }

      if (opts.enableCheckboxes) {
        plugins.push(() => {
          return (tree: HtmlRoot) => {
            visit(tree, "element", (node) => {
              if (node.properties.type === "checkbox" && node.properties.disabled) {
                node.properties.disabled = false
              }
            })
          }
        })
      }

      return plugins
    },
  }
}
