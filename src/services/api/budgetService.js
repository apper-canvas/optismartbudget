import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class BudgetService {
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

      const response = await client.fetchRecords('budgets_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "monthlyLimit_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "alertThreshold_c"}},
          {"field": {"Name": "alertMethods_c"}},
          {"field": {"Name": "category_c"}}
        ]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching budgets:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      const response = await client.getRecordById('budgets_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "monthlyLimit_c"}},
          {"field": {"Name": "spent_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "alertThreshold_c"}},
          {"field": {"Name": "alertMethods_c"}},
          {"field": {"Name": "category_c"}}
        ]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error)
      throw error
    }
  }

  async create(budgetData) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      // Map field names to database schema
      const mappedData = {
        Name: budgetData.category_c || budgetData.category,
        monthlyLimit_c: parseFloat(budgetData.monthlyLimit_c || budgetData.monthlyLimit),
        spent_c: parseFloat(budgetData.spent_c || budgetData.spent || 0),
        month_c: budgetData.month_c || budgetData.month,
        alertThreshold_c: parseInt(budgetData.alertThreshold_c || budgetData.alertThreshold || 80),
        alertMethods_c: Array.isArray(budgetData.alertMethods_c || budgetData.alertMethods) 
          ? (budgetData.alertMethods_c || budgetData.alertMethods).join(',')
          : (budgetData.alertMethods_c || budgetData.alertMethods || 'email,push'),
        category_c: parseInt(budgetData.category_c?.Id || budgetData.category_c || budgetData.category?.Id || budgetData.category)
      }

      const response = await client.createRecord('budgets_c', {
        records: [mappedData]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} budgets:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        return response.results.find(r => r.success)?.data
      }

      return response.data
    } catch (error) {
      console.error("Error creating budget:", error)
      throw error
    }
  }

  async update(id, budgetData) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      // Map field names to database schema
      const mappedData = {
        Id: parseInt(id),
        Name: budgetData.category_c || budgetData.category,
        monthlyLimit_c: parseFloat(budgetData.monthlyLimit_c || budgetData.monthlyLimit),
        spent_c: parseFloat(budgetData.spent_c || budgetData.spent),
        month_c: budgetData.month_c || budgetData.month,
        alertThreshold_c: parseInt(budgetData.alertThreshold_c || budgetData.alertThreshold),
        alertMethods_c: Array.isArray(budgetData.alertMethods_c || budgetData.alertMethods)
          ? (budgetData.alertMethods_c || budgetData.alertMethods).join(',')
          : (budgetData.alertMethods_c || budgetData.alertMethods),
        category_c: parseInt(budgetData.category_c?.Id || budgetData.category_c || budgetData.category?.Id || budgetData.category)
      }

      // Remove undefined fields
      Object.keys(mappedData).forEach(key => {
        if (mappedData[key] === undefined || mappedData[key] === null) {
          delete mappedData[key]
        }
      })

      const response = await client.updateRecord('budgets_c', {
        records: [mappedData]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} budgets:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        return response.results.find(r => r.success)?.data
      }

      return response.data
    } catch (error) {
      console.error(`Error updating budget ${id}:`, error)
      throw error
    }
  }

  async delete(id) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      const response = await client.deleteRecord('budgets_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} budgets:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
      }

      return true
    } catch (error) {
      console.error(`Error deleting budget ${id}:`, error)
      throw error
    }
  }
}

export const budgetService = new BudgetService()