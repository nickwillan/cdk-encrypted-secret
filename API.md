# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### EncryptedSecret <a name="EncryptedSecret" id="cdk-encrypted-secret.EncryptedSecret"></a>

EncryptedSecret is a custom construct that creates a Secret in Secrets Manager and decrypts the ciphertext using the KMS Key ARN provided and stores the decrypted value in the Secret.

#### Initializers <a name="Initializers" id="cdk-encrypted-secret.EncryptedSecret.Initializer"></a>

```typescript
import { EncryptedSecret } from 'cdk-encrypted-secret'

new EncryptedSecret(scope: Construct, id: string, props: EncryptedSecretProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-encrypted-secret.EncryptedSecret.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-encrypted-secret.EncryptedSecret.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-encrypted-secret.EncryptedSecret.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-encrypted-secret.EncryptedSecretProps">EncryptedSecretProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-encrypted-secret.EncryptedSecret.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-encrypted-secret.EncryptedSecret.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-encrypted-secret.EncryptedSecret.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-encrypted-secret.EncryptedSecretProps">EncryptedSecretProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-encrypted-secret.EncryptedSecret.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-encrypted-secret.EncryptedSecret.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-encrypted-secret.EncryptedSecret.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="cdk-encrypted-secret.EncryptedSecret.isConstruct"></a>

```typescript
import { EncryptedSecret } from 'cdk-encrypted-secret'

EncryptedSecret.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="cdk-encrypted-secret.EncryptedSecret.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-encrypted-secret.EncryptedSecret.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-encrypted-secret.EncryptedSecret.property.secret">secret</a></code> | <code>aws-cdk-lib.aws_secretsmanager.Secret</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-encrypted-secret.EncryptedSecret.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `secret`<sup>Required</sup> <a name="secret" id="cdk-encrypted-secret.EncryptedSecret.property.secret"></a>

```typescript
public readonly secret: Secret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.Secret

---


## Structs <a name="Structs" id="Structs"></a>

### EncryptedSecretProps <a name="EncryptedSecretProps" id="cdk-encrypted-secret.EncryptedSecretProps"></a>

EncryptedSecretProps defines the properties for the EncryptedSecret construct.

#### Initializer <a name="Initializer" id="cdk-encrypted-secret.EncryptedSecretProps.Initializer"></a>

```typescript
import { EncryptedSecretProps } from 'cdk-encrypted-secret'

const encryptedSecretProps: EncryptedSecretProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-encrypted-secret.EncryptedSecretProps.property.ciphertextBlob">ciphertextBlob</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-encrypted-secret.EncryptedSecretProps.property.keyId">keyId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-encrypted-secret.EncryptedSecretProps.property.existingSecretObj">existingSecretObj</a></code> | <code>aws-cdk-lib.aws_secretsmanager.Secret</code> | *No description.* |
| <code><a href="#cdk-encrypted-secret.EncryptedSecretProps.property.secretProps">secretProps</a></code> | <code>aws-cdk-lib.aws_secretsmanager.SecretProps</code> | *No description.* |

---

##### `ciphertextBlob`<sup>Required</sup> <a name="ciphertextBlob" id="cdk-encrypted-secret.EncryptedSecretProps.property.ciphertextBlob"></a>

```typescript
public readonly ciphertextBlob: string;
```

- *Type:* string

---

##### `keyId`<sup>Required</sup> <a name="keyId" id="cdk-encrypted-secret.EncryptedSecretProps.property.keyId"></a>

```typescript
public readonly keyId: string;
```

- *Type:* string

---

##### `existingSecretObj`<sup>Optional</sup> <a name="existingSecretObj" id="cdk-encrypted-secret.EncryptedSecretProps.property.existingSecretObj"></a>

```typescript
public readonly existingSecretObj: Secret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.Secret

---

##### `secretProps`<sup>Optional</sup> <a name="secretProps" id="cdk-encrypted-secret.EncryptedSecretProps.property.secretProps"></a>

```typescript
public readonly secretProps: SecretProps;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.SecretProps

---



