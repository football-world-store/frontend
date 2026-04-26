# Domínio — Football World Store

Sistema de gestão de estoque para loja de artigos esportivos (camisas de futebol, shorts, meião, agasalhos, acessórios, calçados).

## Linguagem ubíqua

| Termo | Definição |
|-------|-----------|
| **Produto** | Item do catálogo (camisa, short, etc.) com código interno único |
| **Estoque mínimo** | Quantidade que, quando atingida, dispara status "Crítico" |
| **Produto crítico** | Estoque atual ≤ estoque mínimo |
| **Produto parado** | Sem nenhuma saída nos últimos 30 dias |
| **Entrada** | Registro de mercadoria recebida (incrementa estoque) |
| **Estorno** | Reversão de entrada (apenas Dono pode fazer) |
| **Venda** | Saída de mercadoria com registro de canal e pagamento |
| **Canal de venda** | Loja física, Instagram ou WhatsApp |
| **Cliente ativo** | Última compra nos últimos 30 dias |
| **Cliente esfriando** | Última compra entre 31 e 60 dias |
| **Cliente sumido** | Sem comprar há mais de 60 dias |
| **VIP** | Cliente com gasto total ≥ R$ 2.000 |
| **Dono** | Perfil com acesso total ao sistema |
| **Funcionário** | Perfil restrito (não vê custos, margens, relatórios financeiros) |

## Entidades

### Product
```typescript
{
  id: string
  internalCode: string        // Código interno único (gerado automaticamente)
  name: string                // Ex: "Camisa Flamengo I 2024/25"
  clubOrBrand: string         // Ex: "Flamengo", "Nike"
  category: ProductCategory   // CAMISA | SHORT | MEIAO | AGASALHO | ACESSORIO | CALCADO
  size: string                // P, M, G, GG ou numeração
  photoUrl: string | null     // Upload de 1 imagem
  costPrice: number           // Visível apenas para Dono
  salePrice: number
  quantity: number            // Estoque atual
  minStock: number            // Dispara alerta quando atingido
  isActive: boolean           // Produtos com histórico são inativados, não excluídos
  lastSaleAt: string | null
  totalSold: number
}
```

### Customer
```typescript
{
  id: string
  name: string
  phone: string | null        // WhatsApp (com validação)
  email: string | null
  status: CustomerStatus      // ACTIVE | COOLING | INACTIVE (automático)
  totalSpent: number
  totalOrders: number
  lastPurchaseAt: string | null
  createdAt: string
}
```

### Sale (a implementar)
```typescript
{
  id: string
  channel: SaleChannel        // LOJA_FISICA | INSTAGRAM | WHATSAPP
  paymentMethod: PaymentMethod // DINHEIRO | PIX | DEBITO | CREDITO
  status: SaleStatus          // CONFIRMED | CANCELLED
  customerId: string | null
  customerName: string | null
  totalAmount: number
  soldAt: string
  soldBy: string
  items: SaleItem[]           // Múltiplos itens por venda
}
```

### StockEntry
```typescript
{
  id: string
  productId: string
  productName: string
  type: StockMovementType     // ENTRY | REVERSE
  quantity: number
  unitCost: number
  registeredAt: string
  registeredBy: string        // Preenchido automaticamente
}
```

### Alert
```typescript
{
  id: string
  type: AlertType             // STOCK_LOW | STOCK_OUT | PRODUCT_IDLE
  severity: AlertSeverity     // CRITICAL | INFORMATIONAL
  productId: string | null
  productName: string | null
  message: string
  createdAt: string
  acknowledgedAt: string | null
}
```

### SystemUser
```typescript
{
  id: string
  name: string
  email: string
  role: UserRole              // OWNER | EMPLOYEE
  isActive: boolean
  createdAt: string
  lastLoginAt: string | null
}
```

## Perfis e permissões

| Ação | Dono | Funcionário |
|------|------|-------------|
| Cadastrar/editar produtos | ✅ | ✅ |
| Ver preço de custo | ✅ | ❌ |
| Ver margem de lucro | ✅ | ❌ |
| Excluir/inativar produto | ✅ | ❌ |
| Registrar entrada/saída | ✅ | ✅ |
| Estornar entrada | ✅ | ❌ |
| Cancelar venda | ✅ | ❌ |
| Acessar dashboard/insights | ✅ | ❌ |
| Cadastrar clientes | ✅ | ✅ |
| Criar/editar usuários | ✅ | ❌ |
| Ver log de auditoria | ✅ | ❌ |

## Regras de negócio

1. **Estoque nunca fica negativo** — sistema bloqueia vendas que deixariam estoque < 0
2. **Entradas confirmadas são imutáveis** — apenas estorno (Dono)
3. **Produtos com histórico não são excluídos** — marcados como inativos
4. **Código interno é único** — gerado automaticamente
5. **Status do cliente é automático** — baseado em dias desde última compra
6. **Alertas disparam automaticamente** — estoque mínimo, zerado, produto parado (30+ dias)
