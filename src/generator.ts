import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/internals'
import { GENERATOR_NAME } from './constants'
import fs from 'node:fs'

const { version } = require('../package.json')

const cSharpTypeMap: Record<string, string> = {
  String: 'string',
  Int: 'int',
  DateTime: 'DateTime',
  Boolean: 'bool',
}

const convertToList = (type: string) => `List<${type}>`

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`)

    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: async (options: GeneratorOptions) => {
    const output = options.generator.output?.value

    if (!output) {
      return
    }

    let content = 'namespace HH.Services.Models\n{'

    options.dmmf.datamodel.enums.forEach((enumType) => {
      content += `\n  public enum ${enumType.name}`
      content += '  {'
      enumType.values.forEach((value, idx) => {
        const isLast = idx === enumType.values.length - 1
        content += `\n    ${value.name}${isLast ? '' : ','}`
      })

      content += '\n  }'
    })

    options.dmmf.datamodel.models.forEach(async (model) => {
      content += `\n  public record ${model.name}(`
      model.fields.forEach((field, idx) => {
        const isLast = idx === model.fields.length - 1
        const singleType =
          field.kind === 'scalar' ? cSharpTypeMap[field.type] : field.type
        const type = field.isList ? convertToList(singleType) : singleType

        content += `\n    ${type}${field.isRequired ? '' : '?'} ${field.name}${isLast ? '' : ','}`
      })
      content += '\n  );'
    })

    content += '\n}'

    fs.writeFileSync(output, content)
  },
})