import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class TransactionService {
  constructor() {
    this.apperClient = null
  }

  getClient() {
    if (!this.apperClient) {
      this.apperClient = getApperClient()
    }
    return this.apperClient
  }

  async getAll() {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      const response = await client.fetchRecords('transactions_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching transactions:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      const response = await client.getRecordById('transactions_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}}
        ]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error)
      throw error
    }
  }

  async create(transactionData) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      // Map field names to database schema
      const mappedData = {
        Name: transactionData.description || `${transactionData.type_c} - ${transactionData.amount_c}`,
        amount_c: parseFloat(transactionData.amount_c),
        category_c: parseInt(transactionData.category_c?.Id || transactionData.category_c),
        date_c: transactionData.date_c,
        description_c: transactionData.description_c,
        type_c: transactionData.type_c
      }

      const response = await client.createRecord('transactions_c', {
        records: [mappedData]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} transactions:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        return response.results.find(r => r.success)?.data
      }

      return response.data
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw error
    }
  }

  async update(id, transactionData) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      // Map field names to database schema
      const mappedData = {
        Id: parseInt(id),
        Name: transactionData.description || `${transactionData.type_c} - ${transactionData.amount_c}`,
        amount_c: parseFloat(transactionData.amount_c),
        category_c: parseInt(transactionData.category_c?.Id || transactionData.category_c),
        date_c: transactionData.date_c,
        description_c: transactionData.description_c,
        type_c: transactionData.type_c
      }

      const response = await client.updateRecord('transactions_c', {
        records: [mappedData]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} transactions:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        return response.results.find(r => r.success)?.data
      }

      return response.data
    } catch (error) {
      console.error(`Error updating transaction ${id}:`, error)
      throw error
    }
  }

  async delete(id) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      const response = await client.deleteRecord('transactions_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} transactions:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
      }

      return true
    } catch (error) {
      console.error(`Error deleting transaction ${id}:`, error)
      throw error
    }
  }
}

export const transactionService = new TransactionService()