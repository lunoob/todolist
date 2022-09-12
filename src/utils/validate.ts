import { isFunction } from './isFunction'

export type Validator = (value: any, errorMsg: string) => string | undefined
export type RuleObject = {
  value: any
  rules: {
    validator: Validator
    message: string
  }[]
}

export function validate(rules: RuleObject[]): Promise<string>
export function validate(rules: RuleObject[], callback: (errorMsg: string) => any): void

/**
 * 规则校验器
 */
export function validate (rules: RuleObject[], callback?: Function) {
  if (callback != null && isFunction(callback)) {
    return setTimeout(() => {
      callback(validateRules(rules))
    })
  }

  return Promise.resolve(validateRules(rules))
}

/**
 * 对校验规则进行校验
 */
function validateRules (ruleObjList: RuleObject[]): string | undefined {
  try {
    ruleObjList.forEach(ruleObj => {
      const { value, rules } = ruleObj
      rules.forEach(rule => {
        const validResult = rule.validator(value, rule.message)
        if (validResult) {
          throw new Error(validResult)
        }
      })
    })
  } catch (error) {
    // @ts-ignore
    return error.message
  }
}

// 校验规则函数字典
export const validators = {
  isEmpty (value: string, errorMsg: string) {
    if (value === '') {
      return errorMsg
    }
  },
  isNumber (value: string, errorMsg: string) {
    if (Number.isNaN(+value)) {
      return errorMsg
    }
  }
}

// const rules: RuleObject[] = [
//   {
//     value: '',
//     rules: [
//       { validator: validators.isEmpty, message: '不能为空' }
//     ]
//   }
// ]

// 异步校验
// validate(rules, (errorMsg: string) => {

// })

// await validate(rules)
