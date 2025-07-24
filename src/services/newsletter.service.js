// Newsletter service for handling email subscriptions with Philippine Data Privacy Act compliance
import { supabase } from '../config/supabase';

/**
 * Subscribe an email to the newsletter with Philippine Data Privacy Act compliance
 * @param {string} email - The email address to subscribe
 * @param {object} consentData - Consent data required for Philippine Data Privacy Act compliance
 * @param {boolean} consentData.consentGiven - Explicit consent given by user
 * @param {string} consentData.privacyPolicyVersion - Version of privacy policy consented to
 * @param {string} consentData.consentSource - Source where consent was obtained
 * @returns {Promise<object>} The subscription result
 */
export const subscribeToNewsletter = async (email, consentData = {}) => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate Philippine Data Privacy Act compliance requirements
    if (!consentData.consentGiven) {
      throw new Error('Consent is required to receive communications from SafePin');
    }

    // Check if email already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from('newsletter_subscriptions')
      .select('id, is_active')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error('Failed to check subscription status');
    }

    if (existingSubscription) {
      if (existingSubscription.is_active) {
        return {
          success: true,
          message: 'You are already subscribed to our newsletter!',
          alreadySubscribed: true
        };
      } else {
        // Reactivate subscription with new consent
        const { data, error } = await supabase
          .from('newsletter_subscriptions')
          .update({
            is_active: true,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
            consent_given: consentData.consentGiven,
            consent_timestamp: new Date().toISOString(),
            privacy_policy_version: consentData.privacyPolicyVersion || '1.0',
            data_retention_acknowledged: true, // Implied by privacy policy acceptance
            npc_rights_acknowledged: true, // Implied by privacy policy acceptance
            consent_source: consentData.consentSource || 'website_footer',
            data_processing_purpose: 'newsletter_communications'
          })
          .eq('email', email.toLowerCase())
          .select()
          .single();

        if (error) {
          throw new Error('Failed to reactivate newsletter subscription');
        }

        return {
          success: true,
          message: 'Successfully resubscribed to our newsletter!',
          data
        };
      }
    }

    // Add new subscription with Philippine Data Privacy Act compliance
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([
        {
          email: email.toLowerCase(),
          subscribed_at: new Date().toISOString(),
          is_active: true,
          consent_given: consentData.consentGiven,
          consent_timestamp: new Date().toISOString(),
          privacy_policy_version: consentData.privacyPolicyVersion || '1.0',
          data_retention_acknowledged: true, // Implied by privacy policy acceptance
          npc_rights_acknowledged: true, // Implied by privacy policy acceptance
          consent_source: consentData.consentSource || 'website_footer',
          data_processing_purpose: 'newsletter_communications'
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error('Failed to subscribe to newsletter');
    }

    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'An error occurred while subscribing'
    };
  }
};

/**
 * Unsubscribe an email from the newsletter with Philippine Data Privacy Act compliance
 * @param {string} email - The email address to unsubscribe
 * @param {string} reason - Optional reason for unsubscribing (for NPC compliance)
 * @returns {Promise<object>} The unsubscription result
 */
export const unsubscribeFromNewsletter = async (email, reason = '') => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .update({ 
        is_active: false, 
        unsubscribed_at: new Date().toISOString(),
        unsubscribe_reason: reason
      })
      .eq('email', email.toLowerCase())
      .select()
      .single();

    if (error) {
      throw new Error('Failed to unsubscribe from newsletter');
    }

    return {
      success: true,
      message: 'Successfully unsubscribed from newsletter. Your data will be retained according to our data retention policy as required by Philippine law. You may contact us to request data deletion in accordance with your rights under the Data Privacy Act of 2012.',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'An error occurred while unsubscribing'
    };
  }
};

/**
 * Get data privacy information for Philippine compliance
 * @returns {object} Data privacy information
 */
export const getDataPrivacyInfo = () => {
  return {
    dataPrivacyAct: {
      name: 'Data Privacy Act of 2012',
      republicAct: 'Republic Act No. 10173',
      description: 'Philippine law protecting personal data in information and communications systems'
    },
    npcInfo: {
      name: 'National Privacy Commission',
      website: 'https://www.privacy.gov.ph',
      complaintEmail: 'complaints@privacy.gov.ph',
      hotline: '+63 2 8234 2228'
    },
    dataSubjectRights: [
      'Right to be informed',
      'Right to access',
      'Right to object',
      'Right to erasure or blocking',
      'Right to rectify',
      'Right to file a complaint',
      'Right to damages'
    ],
    dataRetentionPolicy: {
      activeSubscriptions: 'Retained while subscription is active',
      inactiveSubscriptions: 'Retained for 2 years after unsubscription for compliance purposes',
      deletionRequest: 'Data can be deleted upon request in accordance with Data Privacy Act'
    },
    processingPurpose: 'Newsletter communications and service updates',
    legalBasis: 'Consent under Article III, Section 12 of the Data Privacy Act of 2012'
  };
};