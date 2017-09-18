---
title: angular form 表单
comments: true
---
## checkbox
module：import {CheckboxControlValueAccessor} from '@abgular/forms';

- input[type=checkbox][formCtontrolName]
- input[type=checkbox][formControl]
- input[type=checkbox][ngModel]

用于写入值并在复选框输入元素上监听更改的访问器

<input type="checkbox" name = "rememberLogin" ngModel>

### 数据驱动
响应式表单：原理是一开始就构建整个表单，表单的值通过特殊指令formControlName 

- formGroup :用来追踪表单控件有效状态及值，可以理解为获取且可以操作整个表单的数据
- formBuilder :表单数据构建工具[构建初始表单]
- formContlName :同步与formGrop 构建表单内相同字段的值

### 响应式表单验证
响应式表单与模板驱动表单不同的是，响应式表单在组件类中创建表单控制模型，可在组件中随意控制校验规则。
响应式表单使用ReactiveFormsModule,而非普通的formModule,需要在app.module。ts里导入。

reactiveFormsModule 包含formControlDirective、formGroupDirective、formControlName、formArrayName和
internalFormSharedModule模板里的指令。
- formControlDirective 描述表单的一个字段
- formGroupDirective 描述表单分组
- formControlName 描述变淡字段名
- formArrayaName 描述同类型的一组数据的名称，与表单分组无关